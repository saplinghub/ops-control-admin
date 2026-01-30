import { Provide, Scope, ScopeEnum, Inject, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OpsAgentEntity } from '../entity/agent';
import { OpsProjectEntity } from '../entity/project';
import { OpsServiceEntity } from '../entity/service';
import { OpsAuditLogEntity } from '../entity/audit_log';
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as _ from 'lodash';

@Provide()
@Scope(ScopeEnum.Singleton)
export class OpsWsService {
  @InjectEntityModel(OpsAgentEntity)
  opsAgentEntity: Repository<OpsAgentEntity>;

  @InjectEntityModel(OpsProjectEntity)
  opsProjectEntity: Repository<OpsProjectEntity>;

  @InjectEntityModel(OpsServiceEntity)
  opsServiceEntity: Repository<OpsServiceEntity>;

  @InjectEntityModel(OpsAuditLogEntity)
  opsAuditLogEntity: Repository<OpsAuditLogEntity>;

  @Config('module.ops.agent')
  agentConfig;

  // 存放在线连接: agentId -> socket
  private clients = new Map<string, any>();

  /**
   * 校验签名
   */
  verifySignature(query: any): boolean {
    const { agent_id, ts, sig } = query;
    if (!agent_id || !ts || !sig) return false;

    // 时间窗口检查 (10秒)
    const diff = Math.abs(moment().unix() - parseInt(ts));
    if (diff > 10) return false;

    // HMAC-SHA256 签名校验
    const expectedSig = crypto
      .createHmac('sha256', this.agentConfig.token)
      .update(ts)
      .digest('hex');

    return sig === expectedSig;
  }

  /**
   * 注册客户端
   */
  async register(agentId: string, socket: any) {
    this.clients.set(agentId, socket);
    await this.updateOnlineStatus(agentId, true);
  }

  /**
   * 注销客户端
   */
  async unregister(agentId: string) {
    this.clients.delete(agentId);
    await this.updateOnlineStatus(agentId, false);
  }

  /**
   * 更新在线状态
   */
  private async updateOnlineStatus(agentId: string, isOnline: boolean) {
    await this.opsAgentEntity.update(
      { agentId },
      {
        isOnline,
        lastSeen: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    );
  }

  /**
   * 更新心跳
   */
  async updateHeartbeat(agentId: string) {
    await this.opsAgentEntity.update(
      { agentId },
      { lastSeen: moment().format('YYYY-MM-DD HH:mm:ss') }
    );
  }

  /**
   * 处理状态上报
   */
  async handleStatusReport(agentId: string, report: any) {
    // 1. 更新或创建 Agent
    let agent = await this.opsAgentEntity.findOneBy({ agentId });
    if (!agent) {
      agent = await this.opsAgentEntity.save({ agentId, name: agentId, isOnline: true });
    }

    // 2. 更新项目和服务 (事务)
    for (const projData of report.projects || []) {
      let project = await this.opsProjectEntity.findOneBy({ agentId, name: projData.name });
      if (!project) {
        project = await this.opsProjectEntity.save({ agentId, name: projData.name, path: projData.path });
      } else {
        await this.opsProjectEntity.update({ id: project.id }, { path: projData.path });
      }

      for (const svcData of projData.services || []) {
        let service = await this.opsServiceEntity.findOneBy({ projectId: project.id, name: svcData.name });
        const updateData = {
          status: svcData.status,
          health: svcData.health,
          restartCount: svcData.restartCount,
          agentId: agentId
        };
        if (!service) {
          await this.opsServiceEntity.save({ projectId: project.id, name: svcData.name, ...updateData });
        } else {
          await this.opsServiceEntity.update({ id: service.id }, updateData);
        }
      }
    }
  }

  /**
   * 处理任务结果
   */
  async handleTaskResult(agentId: string, result: any) {
    const { taskId, success, output } = result;
    if (taskId) {
      await this.opsAuditLogEntity.update(taskId, {
        status: success ? 1 : 0,
        result: output || (success ? '执行成功' : '执行失败')
      });
    }
  }

  /**
   * 下发任务
   */
  async sendTask(agentId: string, task: any) {
    const socket = this.clients.get(agentId);
    if (!socket) throw new Error(`Agent ${agentId} 不在线`);

    socket.send(JSON.stringify({
      type: 'task_request',
      agent_id: agentId,
      payload: task
    }));
  }
}

import { Provide, Inject } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OpsAgentEntity } from '../entity/agent';
import { OpsWsService } from './ws';
import { OpsAuditLogEntity } from '../entity/audit_log';

/**
 * Agent 服务
 */
@Provide()
export class OpsAgentService extends BaseService {
  @InjectEntityModel(OpsAgentEntity)
  opsAgentEntity: Repository<OpsAgentEntity>;

  @InjectEntityModel(OpsAuditLogEntity)
  opsAuditLogEntity: Repository<OpsAuditLogEntity>;

  @Inject()
  opsWsService: OpsWsService;

  /**
   * 执行远程操作
   * @param agentId
   * @param action
   * @param target
   * @param operator
   */
  async action(agentId: string, action: string, target: string, operator: string) {
    const agent = await this.opsAgentEntity.findOneBy({ agentId });
    if (!agent) throw new CoolCommException('Agent不存在');
    if (!agent.isOnline) throw new CoolCommException('Agent处于离线状态');

    // 1. 记录审计日志 (初始状态为待处理)
    const log = await this.opsAuditLogEntity.save({
      agentId,
      action,
      target,
      operator,
      status: 0, // 初始为失败/处理中，待结果返回更新
      result: '指令已下发，等待响应...'
    });

    try {
      // 2. 下发指令
      await this.opsWsService.sendTask(agentId, {
        taskId: log.id.toString(),
        action,
        target
      });
    } catch (e) {
      await this.opsAuditLogEntity.update(log.id, { result: `下发失败: ${e.message}`, status: 0 });
      throw new CoolCommException(e.message);
    }
  }
}

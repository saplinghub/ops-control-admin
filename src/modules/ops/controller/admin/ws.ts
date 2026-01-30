import { WSController, OnWSConnection, OnWSDisConnection, OnWSMessage, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { OpsWsService } from '../../service/ws';
import * as http from 'http';

@WSController('/ws/agent')
export class OpsWsController {
  @Inject()
  ctx: Context;

  @Inject()
  opsWsService: OpsWsService;

  @OnWSConnection()
  async onConnection(socket: Context, request: http.IncomingMessage) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const query = Object.fromEntries(url.searchParams.entries());
    const agentId = query.agent_id;

    // 1. 签名校验
    if (!this.opsWsService.verifySignature(query)) {
      console.error(`[OpsWS] 签名校验失败: agentId=${agentId}`);
      socket.terminate();
      return;
    }

    // 2. 注册
    await this.opsWsService.register(agentId, socket);
    console.log(`[OpsWS] Agent 已连接: ${agentId}`);

    // 设置 agentId 到 socket 实例方便后续使用
    (socket as any).agentId = agentId;
  }

  @OnWSDisConnection()
  async onDisConnection() {
    const agentId = (this.ctx as any).agentId;
    if (agentId) {
      await this.opsWsService.unregister(agentId);
      console.log(`[OpsWS] Agent 已断开: ${agentId}`);
    }
  }

  @OnWSMessage('message')
  async onMessage(data: any) {
    const agentId = (this.ctx as any).agentId;
    if (!agentId) return;

    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case 'heartbeat':
          await this.opsWsService.updateHeartbeat(agentId);
          break;
        case 'status_report':
          await this.opsWsService.handleStatusReport(agentId, msg.payload);
          break;
        case 'task_result':
          await this.opsWsService.handleTaskResult(agentId, msg.payload);
          break;
      }
    } catch (e) {
      console.error(`[OpsWS] 消息处理失败: ${e.message}`);
    }
  }
}

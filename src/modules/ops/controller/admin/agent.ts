import { Post, Body, Inject } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { OpsAgentEntity } from '../../entity/agent';
import { OpsAgentService } from '../../service/agent';

/**
 * Agent 管理
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: OpsAgentEntity,
  service: OpsAgentService
})
export class OpsAgentController extends BaseController {
  @Inject()
  opsAgentService: OpsAgentService;

  @Post('/action', { summary: '执行运维操作' })
  async action(@Body() body) {
    const { agentId, action, target } = body;
    // 此处简化处理，实际应从 ctx.admin.username 获取
    await this.opsAgentService.action(agentId, action, target, 'admin');
    return this.ok();
  }
}

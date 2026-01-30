import { CoolController, BaseController } from '@cool-midway/core';
import { OpsServiceEntity } from '../../entity/service';
import { OpsServiceService } from '../../service/service';

/**
 * 容器服务管理
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: OpsServiceEntity,
  service: OpsServiceService
})
export class OpsServiceController extends BaseController {}

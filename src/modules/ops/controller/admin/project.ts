import { CoolController, BaseController } from '@cool-midway/core';
import { OpsProjectEntity } from '../../entity/project';
import { OpsProjectService } from '../../service/project';

/**
 * 项目管理
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: OpsProjectEntity,
  service: OpsProjectService
})
export class OpsProjectController extends BaseController {}

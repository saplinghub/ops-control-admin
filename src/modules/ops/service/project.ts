import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OpsProjectEntity } from '../entity/project';

/**
 * 项目服务
 */
@Provide()
export class OpsProjectService extends BaseService {
  @InjectEntityModel(OpsProjectEntity)
  opsProjectEntity: Repository<OpsProjectEntity>;
}

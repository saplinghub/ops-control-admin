import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OpsServiceEntity } from '../entity/service';

/**
 * 容器服务
 */
@Provide()
export class OpsServiceService extends BaseService {
  @InjectEntityModel(OpsServiceEntity)
  opsServiceEntity: Repository<OpsServiceEntity>;
}

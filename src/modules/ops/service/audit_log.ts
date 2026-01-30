import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OpsAuditLogEntity } from '../entity/audit_log';

/**
 * 审计日志服务
 */
@Provide()
export class OpsAuditLogService extends BaseService {
  @InjectEntityModel(OpsAuditLogEntity)
  opsAuditLogEntity: Repository<OpsAuditLogEntity>;
}

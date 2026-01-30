import { CoolController, BaseController } from '@cool-midway/core';
import { OpsAuditLogEntity } from '../../entity/audit_log';
import { OpsAuditLogService } from '../../service/audit_log';

/**
 * 审计日志
 */
@CoolController({
  api: ['add', 'delete', 'info', 'list', 'page'],
  entity: OpsAuditLogEntity,
  service: OpsAuditLogService
})
export class OpsAuditLogController extends BaseController {}

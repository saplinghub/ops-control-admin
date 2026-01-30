import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/**
 * 运维审计日志
 */
@Entity('ops_audit_log')
export class OpsAuditLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '所属Agent唯一ID' })
  agentId: string;

  @Column({ comment: '操作动作 (restart, stop, start, logs, etc.)' })
  action: string;

  @Column({ comment: '目标名称 (项目或服务名)' })
  target: string;

  @Column({ comment: '操作人', nullable: true })
  operator: string;

  @Column({ comment: '指令详情', type: 'text', nullable: true })
  command: string;

  @Column({ comment: '执行结果', type: 'text', nullable: true })
  result: string;

  @Column({ comment: '执行状态 (0:失败, 1:成功)', default: 1 })
  status: number;
}

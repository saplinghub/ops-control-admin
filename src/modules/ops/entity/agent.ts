import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/**
 * Agent 服务器
 */
@Entity('ops_agent')
export class OpsAgentEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: 'Agent唯一ID (UUID/MachineID)' })
  agentId: string;

  @Column({ comment: '服务器名称' })
  name: string;

  @Column({ comment: '最后在线时间', nullable: true, type: 'varchar' })
  lastSeen: string;

  @Column({ comment: '是否在线', default: false })
  isOnline: boolean;

  @Column({ comment: 'Agent版本', nullable: true })
  version: string;

  @Column({ comment: '服务器IP', nullable: true })
  ip: string;
}

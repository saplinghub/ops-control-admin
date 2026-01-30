import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/**
 * Docker 项目 (Compose项目)
 */
@Entity('ops_project')
export class OpsProjectEntity extends BaseEntity {
  @Index()
  @Column({ comment: '所属Agent唯一ID' })
  agentId: string;

  @Column({ comment: '项目名称 (目录名)' })
  name: string;

  @Column({ comment: 'Compose文件路径' })
  path: string;

  @Column({ comment: '配置详情', type: 'text', nullable: true })
  config: string;
}

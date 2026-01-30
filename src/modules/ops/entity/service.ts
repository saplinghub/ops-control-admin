import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/**
 * Docker 服务 (Container服务)
 */
@Entity('ops_service')
export class OpsServiceEntity extends BaseEntity {
  @Index()
  @Column({ comment: '所属项目ID' })
  projectId: number;

  @Index()
  @Column({ comment: '所属Agent唯一ID' })
  agentId: string;

  @Column({ comment: '服务名称' })
  name: string;

  @Column({ comment: '运行状态 (running, exited, etc.)' })
  status: string;

  @Column({ comment: '健康状态 (healthy, unhealthy, starting)' })
  health: string;

  @Column({ comment: '重启次数', default: 0 })
  restartCount: number;

  @Column({ comment: '镜像名称', nullable: true })
  image: string;

  @Column({ comment: '容器ID', nullable: true })
  containerId: string;
}

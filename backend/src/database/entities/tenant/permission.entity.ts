import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, Index, Unique } from 'typeorm';
import { Role } from './role.entity';

@Entity('permissions')
@Index(['tenantId'])
@Unique(['tenantId', 'name'])
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  module: string; // 'accounts', 'contacts', 'leads', 'opportunities', 'activities'

  @Column({ type: 'varchar', length: 20 })
  action: string; // 'create', 'read', 'update', 'delete', 'export'

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}

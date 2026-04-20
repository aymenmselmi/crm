import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from './organization.master-entity';

@Entity('tenant_configs')
export class TenantConfig {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  organizationId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  timezone?: string;

  @Column({ type: 'varchar', length: 50, default: 'en' })
  language!: string;

  @Column({ type: 'json', nullable: true })
  customRoles?: any;

  @Column({ type: 'json', nullable: true })
  emailSettings?: any;

  @Column({ type: 'boolean', default: false })
  ssoEnabled!: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ssoUrl?: string;

  @Column({ type: 'json', nullable: true })
  featureFlags?: Record<string, boolean>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization!: Organization;
}

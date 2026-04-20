import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GlobalUser } from './global-user.master-entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  slug!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ type: 'varchar', length: 100, default: 'active' })
  status!: 'active' | 'inactive' | 'suspended';

  @Column({ type: 'varchar', length: 50, default: 'free' })
  planType!: 'free' | 'starter' | 'professional' | 'enterprise';

  @Column({ type: 'integer', default: 5 })
  maxUsers!: number;

  @Column({ type: 'integer', default: 0 })
  currentUsers!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  databaseUrl?: string;

  // Database connection details for tenant database
  @Column({ type: 'varchar', length: 255, default: 'localhost' })
  dbHost!: string;

  @Column({ type: 'integer', default: 5432 })
  dbPort!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dbName?: string; // e.g., crm_tenant_org_uuid

  @Column({ type: 'varchar', length: 255, default: 'postgres' })
  dbUser!: string;

  @Column({ type: 'varchar', length: 255, default: 'postgres' })
  dbPassword!: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => GlobalUser, (user) => user.organization)
  users!: GlobalUser[];
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index, Unique } from 'typeorm';
import { DynamicField } from './dynamic-field.entity';

@Entity('dynamic_entities')
@Index(['tenantId'])
@Unique(['tenantId', 'name'])
export class DynamicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'custom' })
  type: 'standard' | 'custom';

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DynamicField, (field) => field.entity, { cascade: true })
  fields: DynamicField[];
}

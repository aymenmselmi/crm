import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { DynamicEntity } from './dynamic-entity.entity';

@Entity('dynamic_fields')
@Index(['tenantId'])
export class DynamicField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  slug: string;

  @Column({ type: 'varchar', length: 50 })
  type: 'text' | 'number' | 'date' | 'boolean' | 'dropdown' | 'email' | 'phone' | 'url' | 'textarea' | 'currency';

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  required: boolean;

  @Column({ type: 'boolean', default: false })
  unique: boolean;

  @Column({ type: 'json', nullable: true })
  validation: Record<string, any>; // regex, minLength, maxLength, min, max, etc.

  @Column({ type: 'json', nullable: true })
  options: string[]; // for dropdown type

  @Column({ type: 'varchar', length: 255, nullable: true })
  defaultValue: string;

  @Column({ type: 'integer', default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => DynamicEntity, (entity) => entity.fields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityId' })
  entity: DynamicEntity;
}

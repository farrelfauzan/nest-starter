import {
  BaseEntity as TOBaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class BaseEntity extends TOBaseEntity {
  /**
   * The unique id of the entity.
   */
  @PrimaryGeneratedColumn()
  id: number;
}

export class BaseEntityWithDates extends BaseEntity {
  @CreateDateColumn({
    default: () => 'NOW()',
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'NOW()',
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date;
}

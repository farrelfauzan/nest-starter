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
  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'NOW()', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

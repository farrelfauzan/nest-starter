import { Exclude } from 'class-transformer';
import { BaseEntityWithDates } from '../../common/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { hashPassword } from 'src/helpers/password.helpers';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class User extends BaseEntityWithDates {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  fullName: string;

  @Exclude()
  @Column({ nullable: true })
  accessToken?: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken?: string;

  @Exclude()
  @Column({ nullable: true })
  forgotPasswordToken?: string;

  @Column({ nullable: true })
  lastAccessedAt: Date;
}

import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  orderBy: {
    createdAt: 'DESC',
  },
})
export class User extends BaseEntity {
  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

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

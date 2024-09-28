import { User } from '../entities/user.entity';

export class UserDto extends User {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}

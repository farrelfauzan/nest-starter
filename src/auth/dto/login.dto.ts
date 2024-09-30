import { ApiProperty } from '@nestjs/swagger';
import { Resource } from '../../common/resource';

export class AuthLogin extends Resource {
  @ApiProperty()
  expiredIn: number;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  lastAccessedAt: Date;

  @ApiProperty()
  fullName: string;
}

export class AuthLoginDto extends AuthLogin {
  constructor(partial: Partial<AuthLogin>) {
    super();

    Object.assign(this, partial);
  }
}

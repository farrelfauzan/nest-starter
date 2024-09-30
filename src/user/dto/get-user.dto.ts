import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

export class GetUserDto extends PageOptionsDto {
  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  ids?: number[];

  @ApiProperty()
  @IsString()
  @Type(() => String)
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  @IsOptional()
  fullName?: string;
}

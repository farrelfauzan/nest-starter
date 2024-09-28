import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { convertRelationsObjToArray } from 'src/helpers/relations-obj-array';
import { OrderTypeEnum } from 'src/types/enums';

export class PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    return value.constructor === Array
      ? value
      : value.split(',').map((v: string) => Number(v));
  })
  @IsNumber({}, { each: true })
  ids?: number[];

  @ApiPropertyOptional({ enum: OrderTypeEnum, default: OrderTypeEnum.ASC })
  @IsEnum(OrderTypeEnum)
  @IsOptional()
  readonly order?: OrderTypeEnum = OrderTypeEnum.ASC;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly sortBy?: string;

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly page?: number = 0;

  @ApiPropertyOptional({
    minimum: 0,
    default: 5,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly pageSize?: number = 5;

  @IsString()
  // NOTE: TEMPORARY COMMENTED
  // @Transform(({ value }) => (value === '{}' ? null : value))
  @IsOptional()
  readonly query?: string;

  @ApiPropertyOptional()
  @Transform(({ value, obj }) => {
    const { relationsObj } = obj;
    if (relationsObj) {
      const relJson =
        relationsObj.constructor === Object
          ? relationsObj
          : JSON.parse(relationsObj);
      return convertRelationsObjToArray(relJson);
    } else {
      if (value) {
        if (value.constructor === Array) {
          return value;
        } else {
          return value.split(',').map((v: string) => String(v));
        }
      } else {
        return [];
      }
    }
  })
  @IsString({ each: true })
  @IsOptional()
  readonly relations?: string[] = [];

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (value) {
      if (value && value.constructor === Object) {
        return value;
      } else {
        return JSON.parse(value);
      }
    } else {
      return {};
    }
  })
  @IsOptional()
  readonly relationsObj?: { [key: string]: any } = {};

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (value) {
      if (value && value.constructor === Object) {
        return value;
      } else {
        return JSON.parse(value);
      }
    } else {
      return {};
    }
  })
  @IsOptional()
  readonly selectsObj?: { [key: string]: any } = {};

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (value) {
      if (value && value.constructor === Object) {
        return value;
      } else {
        return JSON.parse(value);
      }
    } else {
      return {};
    }
  })
  @IsOptional()
  readonly orderObj?: { [key: string]: any } = {};

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    if (value) {
      if (value && value.constructor === Object) {
        return value;
      } else {
        return JSON.parse(value);
      }
    } else {
      return {};
    }
  })
  @IsOptional()
  readonly wheresObj?: { [key: string]: any } = {};

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  withDeleted?: boolean = false;

  // SKIP CAMPUS PERMIT CHECK
  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  breakthrough?: boolean = false;
}

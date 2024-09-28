import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { BaseRepository } from 'src/common/transaction.interceptor';
import { DataSource, FindOptionsWhere, ILike, In } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import {
  EmployeeAlreadyExistError,
  UserNotFoundError,
} from 'src/errors/ResourceError';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { GetUserDto } from '../dto/get-user.dto';
import { UserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository {
  constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
    super(dataSource, req);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkUserName({ userName: createUserDto.username });
    await this.checkEmail({ email: createUserDto.email });

    const user = new User();

    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;

    await this.getRepository(User).save(user);

    return user;
  }

  async findAll(options: GetUserDto): Promise<{
    users: User[];
    count: number;
    meta: PageMetaDto;
  }> {
    const whereFilters: FindOptionsWhere<User> = {};

    if (options.ids) whereFilters.id = In(options.ids);
    if (options.username)
      whereFilters.username = ILike(`%${options.username}%`);
    if (options.email) whereFilters.email = ILike(`%${options.email}%`);
    if (options.firstName)
      whereFilters.firstName = ILike(`%${options.firstName}%`);
    if (options.lastName)
      whereFilters.lastName = ILike(`%${options.lastName}%`);
    if (options.fullName) {
      whereFilters.firstName = ILike(`%${options.fullName}%`);
      whereFilters.lastName = ILike(`%${options.fullName}%`);
    }

    const [users, count] = await this.getRepository(User).findAndCount({
      where: whereFilters,
      take: options.pageSize,
      skip: options.page * options.pageSize,
      select: {
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        lastAccessedAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    const userDto: UserDto[] = users.map((user) => {
      return new UserDto(user);
    });

    const meta = new PageMetaDto({
      itemCount: count,
      pageOptionsDto: options,
    });

    return { users: userDto, count, meta };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.getRepository(User).findOne({
      where: { id },
      select: {
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        lastAccessedAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },

      cache: true,
    });

    if (!user) UserNotFoundError();

    return new UserDto(user);
  }

  async update(id: number, payload: UpdateUserDto): Promise<User> {
    await this.checkUserName({ userName: payload.username });
    await this.checkEmail({ email: payload.email });

    const user = await this.getRepository(User).findOne({
      where: { id },
    });

    if (!user) UserNotFoundError();

    if (payload.username) user.username = payload.username;
    if (payload.email) user.email = payload.email;
    if (payload.firstName) user.firstName = payload.firstName;
    if (payload.lastName) user.lastName = payload.lastName;

    return await this.getRepository(User).save(user);
  }

  async remove(id: number): Promise<{
    message: string;
  }> {
    const user = await this.getRepository(User).findOne({
      where: { id },
    });

    if (!user) UserNotFoundError();

    await this.getRepository(User).softRemove(user);

    return { message: 'User deleted successfully' };
  }

  private async checkUserName(options: { userName: string }) {
    const user = await this.getRepository(User).findOne({
      where: {
        username: ILike(`%${options.userName}%`),
      },
    });

    if (user) EmployeeAlreadyExistError('username');
  }

  private async checkEmail(options: { email: string }) {
    const user = await this.getRepository(User).findOne({
      where: {
        email: ILike(`%${options.email}%`),
      },
    });

    if (user) EmployeeAlreadyExistError('email');
  }
}

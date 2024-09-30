import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<{
    data: User;
  }> {
    const user = await this.userRepository.create(createUserDto);

    return { data: user };
  }

  async findAll(options: GetUserDto): Promise<{
    data: User[];
    count: number;
    meta: PageMetaDto;
  }> {
    const { users, count, meta } = await this.userRepository.findAll(options);

    return {
      data: users,
      count,
      meta,
    };
  }

  async findOne(id: number): Promise<{
    data: User;
  }> {
    const user = await this.userRepository.findOne(id);

    return { data: user };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    data: User;
  }> {
    const user = await this.userRepository.update(id, updateUserDto);

    return { data: user };
  }

  async remove(id: number): Promise<{
    message: string;
  }> {
    return await this.userRepository.remove(id);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@UsersModule/entities/user.entity';
import { ResponseItem } from '@app/common/dtos';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUser(id: number): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new BadRequestException('Nhân viên không tồn tại');

    return new ResponseItem({ ...user }, 'Thành công');
  }

  async getUserByUserName(username: string): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (!user) throw new BadRequestException('Nhân viên không tồn tại');

    return new ResponseItem({ ...user }, 'Thành công');
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<ResponseItem<UserEntity>> {
    const newUser = this.userRepository.create(createUserDto);
    this.userRepository.save(newUser);
    return new ResponseItem(newUser, 'Created User Successfully');
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseItem<UserEntity>> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.phone) user.phone = updateUserDto.phone;
    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.fullname) user.fullname = updateUserDto.fullname;
    if (updateUserDto.password) user.password = updateUserDto.password;
    if (updateUserDto.role) user.role = updateUserDto.role;

    this.userRepository.save(user);

    return new ResponseItem(user, 'Updated User Successfully');
  }

  async deleteUser(userId: number): Promise<ResponseItem<{ id: number }>> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.userRepository.remove(user);
    return new ResponseItem({ id: userId }, 'Delete User Successfully');
  }

  async getUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}

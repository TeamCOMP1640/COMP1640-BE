import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';

import { ResponseItem } from '@app/common/dtos';

import { UserDto } from './dto/user.dto';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create.dto';
import { UserEntity } from './entities';
import { UpdateUserDto } from './dto/update.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseItem<UserDto>> {
    return await this.usersService.getUser(id);
  }

  @Post('/create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseItem<UserEntity>> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('/update/:id')
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseItem<UserEntity>> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete('/delete/:id')
  async deleteUser(
    @Param('id') userId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    return this.usersService.deleteUser(userId);
  }

  @Get()
  async getUsers(): Promise<ResponseItem<UserEntity>> {
    const users = await this.usersService.getUsers();
    return new ResponseItem(users, 'Get Users Successfully');
  }
}

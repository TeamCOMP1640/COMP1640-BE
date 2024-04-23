import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ResponseItem } from '@app/common/dtos';

import { AuthenticationGuard } from '../auth/guards/auth.guards';
import { CreateUserDto } from './dto/create.dto';
import { EnrolStudentDto } from './dto/enrol.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities';
import { UsersService } from './user.service';

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

  // @UseGuards(AuthenticationGuard)
  @Get()
  async getUsers(
    @Query('role') role?: string,
    @Query('facultyId') facultyId?: number,
  ): Promise<ResponseItem<UserEntity>> {
    let users: UserEntity[];
    if (role) {
      users = await this.usersService.getUsersByRole(role, facultyId);
    } else {
      users = await this.usersService.getUsers();
    }

    return new ResponseItem(users, 'Get Users Successfully');
  }

  @Post('enrol/:id')
  async enrolToFaculty(
    @Param('id') userId: number,
    @Body() enrolStudentDto: EnrolStudentDto,
  ): Promise<ResponseItem<string>> {
    return this.usersService.enrolToFaculty(
      enrolStudentDto.facultyId,
      userId,
      enrolStudentDto.enrolment_key,
    );
  }
}

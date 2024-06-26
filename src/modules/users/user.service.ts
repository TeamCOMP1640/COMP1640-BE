import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity, UserRole } from '@UsersModule/entities/user.entity';
import { ResponseItem } from '@app/common/dtos';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { FacultyEntity } from '../falcuties/entities';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FacultyEntity)
    private readonly facultyRepository: Repository<FacultyEntity>,
  ) {}

  async getUser(id: number): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['faculties'],
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

  async getUsersByRole(role: string): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.role= :role', { role })
      .getMany();
  }

  async enrolToFaculty(
    facultyId: number,
    userId: number,
    enrolmentKey: string,
  ): Promise<ResponseItem<string>> {
    const faculty = await this.facultyRepository.findOneBy({ id: facultyId });
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.role !== UserRole.STUDENT) {
      throw new NotFoundException(`User with ID ${userId} are not student.`);
    }

    if (enrolmentKey == faculty.enrolment_key) {
      faculty.users = faculty.users || [];
      faculty.users.push(user);
      await this.facultyRepository.save(faculty);
    } else {
      throw new NotFoundException(`This key is incorrect`);
    }

    return new ResponseItem(
      null,
      `Assign User ${userId} to the faculty successfully  `,
    );
  }

  private async comparePasswords(
    userPassword: string,
    currentPassword: string,
  ) {
    return await bcrypt.compare(currentPassword, userPassword);
  }

  async findOneByUsername(username: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async validateCredentials({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<UserEntity> {
    const user = await this.findOneByUsername(username);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await this.comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}

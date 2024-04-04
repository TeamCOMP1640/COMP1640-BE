// auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { UserEntity } from '@UsersModule/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(username: string, password: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    return user.role;
  }

  //function hash password
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  //function compare password param with user password in database
  async comparePassword(
    password: string,
    storePasswordHash: string,
  ): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash);
  }

  //   async authentication(username: string, password: string): Promise<any> {
  //     const user = await this.userService.getUserByUserName(username);
  //     const check = await this.comparePassword(password, user.password);

  //     if (!user || !check) {
  //       return false;
  //     }

  //     return user;
  //   }
}

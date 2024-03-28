// auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { UserEntity } from '@UsersModule/entities';
import { UsersService } from '@UsersModule/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}

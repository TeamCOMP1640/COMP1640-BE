// auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { UserEntity } from '@UsersModule/entities';
import { UsersService } from '@UsersModule/user.service';
import { FacultyService } from '@app/modules/falcuties/faculty.service';
import { FacultyEntity } from '@app/modules/falcuties/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FacultyEntity])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, FacultyService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';

import { Repository } from 'typeorm';
import { FacultyEntity } from '../falcuties/entities';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { FacultyModule } from '../falcuties/faculty.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([FacultyEntity]),
    FacultyModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, Repository<FacultyEntity>],
  exports: [UsersService],
})
export class UsersModule {}

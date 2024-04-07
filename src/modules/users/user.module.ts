import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';

import { PassportModule } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { FacultyEntity } from '../falcuties/entities';
import { FacultyModule } from '../falcuties/faculty.module';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([FacultyEntity]),
    FacultyModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, Repository<FacultyEntity>],
  exports: [UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@UsersModule/entities';
import { FacultyEntity } from './entities/faculty.entity';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyEntity, UserEntity])],
  controllers: [FacultyController],
  providers: [FacultyService, ConfigService, Repository<UserEntity>],
  exports: [FacultyService],
})
export class FacultyModule {}

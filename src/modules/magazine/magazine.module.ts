import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@UsersModule/entities';
import { MagazineEntity } from './entities/Magazine.entity';
import { MagazineController } from './magazine.controller';
import { MagazineService } from './magazine.service';
import { Repository } from 'typeorm';
import { FacultyEntity } from '../falcuties/entities';
import { AcademicEntity } from '../academic/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MagazineEntity,
      UserEntity,
      FacultyEntity,
      AcademicEntity,
    ]),
  ],
  controllers: [MagazineController],
  providers: [MagazineService, ConfigService, Repository<UserEntity>],
  exports: [MagazineService],
})
export class MagazineModule {}

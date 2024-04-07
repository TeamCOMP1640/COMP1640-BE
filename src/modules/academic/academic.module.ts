import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service';
import { AcademicEntity } from './entities/academic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicEntity])],
  controllers: [AcademicController],
  providers: [AcademicService, ConfigService],
  exports: [AcademicService],
})
export class AcademicModule {}

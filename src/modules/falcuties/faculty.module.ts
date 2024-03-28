import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacultyEntity } from './entities/faculty.entity';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyEntity])],
  controllers: [FacultyController],
  providers: [FacultyService, ConfigService],
  exports: [FacultyService],
})
export class FacultyModule {}

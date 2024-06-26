import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentController } from './Comment.controller';
import { CommentService } from './Comment.service';
import { CommentEntity } from './entities/Comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity])],
  controllers: [CommentController],
  providers: [CommentService, ConfigService],
  exports: [CommentService],
})
export class CommentModule {}

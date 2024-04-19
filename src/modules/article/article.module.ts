import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleEntity } from './entities/article.entity';
import { MagazineEntity } from '../magazine/entities';
import { UserEntity } from '@UsersModule/entities';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, MagazineEntity, UserEntity]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, ConfigService, CloudinaryService],
  exports: [ArticleService],
})
export class ArticleModule {}

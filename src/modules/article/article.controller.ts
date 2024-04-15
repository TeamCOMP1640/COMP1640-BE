import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ResponseItem } from '@app/common/dtos';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/Article.dto';
import { CreateArticleDto } from './dto/create.dto';
import { ArticleEntity } from './entities';
import { UpdateArticleDto } from './dto/update.dto';

@Controller('Articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get(':id')
  async getArticle(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseItem<ArticleDto>> {
    return await this.articleService.getArticle(id);
  }

  @Post('/create')
  async createArticle(
    @Body() createArticle: CreateArticleDto,
  ): Promise<ResponseItem<ArticleEntity>> {
    return this.articleService.createArticle(createArticle);
  }

  @Patch('/update/:id')
  async updateArticle(
    @Param('id') articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ResponseItem<ArticleEntity>> {
    return this.articleService.updateArticle(articleId, updateArticleDto);
  }

  @Delete('/delete/:id')
  async deleteArticle(
    @Param('id') articleId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    return this.articleService.deleteArticle(articleId);
  }

  @Get()
  async getArticles(): Promise<ResponseItem<ArticleEntity>> {
    const faculties = await this.articleService.getArticles();

    return new ResponseItem(faculties, 'Get Articles Successfully');
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { ResponseItem } from '@app/common/dtos';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/Article.dto';
import { CreateArticleDto } from './dto/create.dto';
import { UpdateArticleDto } from './dto/update.dto';
import { ArticleEntity } from './entities';

import { Response } from 'express';

@Controller('Articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/publication')
  async getPublicationArticles(): Promise<ResponseItem<ArticleEntity>> {
    const faculties = await this.articleService.getArticlesPublication();

    return new ResponseItem(faculties, 'Get Publication Articles Successfully');
  }

  @Get()
  async getArticles(): Promise<ResponseItem<ArticleEntity>> {
    const faculties = await this.articleService.getArticles();

    return new ResponseItem(faculties, 'Get Articles Successfully');
  }

  @Get(':id')
  async getArticle(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseItem<ArticleDto>> {
    return await this.articleService.getArticle(id);
  }

  @Post('/create')
  @UseInterceptors(AnyFilesInterceptor())
  async createArticle(
    @Body() createArticle: CreateArticleDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<ResponseItem<ArticleEntity>> {
    const imageFile = files?.find((file) => file.fieldname === 'file');
    const wordFile = files?.find((file) => file.fieldname === 'wordFile');
    return this.articleService.createArticle(
      createArticle,
      imageFile,
      wordFile,
    );
  }

  @Get('uploads/:filename')
  async getFile(@Param('filename') filename, @Res() res: Response) {
    res.download(`./uploads/${filename}`);
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

  @Put('/publication/:id')
  async publicationArticle(
    @Param('id') articleId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    return this.articleService.publicationArticle(articleId);
  }

  @Get('/student/:id')
  async getArticlesByStudent(
    @Param('id', ParseIntPipe) studentId: number,
    @Query('magazine_id') magazineId: number,
  ): Promise<ResponseItem<ArticleEntity>> {
    return await this.articleService.getArticleByStudent(studentId, magazineId);
  }

  @Get('/magazine/:id')
  async getArticlesByMagazineId(
    @Param('id') magazineId: number,
  ): Promise<ResponseItem<ArticleEntity>> {
    return await this.articleService.getArticleByMagazineId(magazineId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ResponseItem } from '@app/common/dtos';
import { CommentService } from './Comment.service';
import { CommentDto } from './dto/Comment.dto';
import { CreateCommentDto } from './dto/create.dto';
import { UpdateCommentDto } from './dto/update.dto';
import { CommentEntity } from './entities';

@Controller('comments')
export class CommentController {
  constructor(private readonly CommentService: CommentService) {}

  @Get(':id')
  async getComment(
    @Param('id', ParseIntPipe) articleId: number,
    @Query('user_id') userId: number,
  ): Promise<ResponseItem<CommentDto>> {
    return await this.CommentService.getComment(articleId, userId);
  }

  @Get('check/:id')
  async checkIsCoordinatorComment(
    @Param('id', ParseIntPipe) articleId: number,
    @Query('user_id') userId: number,
  ): Promise<ResponseItem<boolean>> {
    return await this.CommentService.checkIsCoordinatorComment(
      articleId,
      userId,
    );
  }

  @Post('/create')
  async createComment(
    @Body() createComment: CreateCommentDto,
  ): Promise<ResponseItem<CommentEntity>> {
    return this.CommentService.createComment(createComment);
  }

  @Patch('/update/:id')
  async updateComment(
    @Param('id') facultyId: number,
    @Body() updateFacultyDto: UpdateCommentDto,
  ): Promise<ResponseItem<CommentEntity>> {
    return this.CommentService.updateComment(facultyId, updateFacultyDto);
  }

  @Delete('/delete/:id')
  async deleteComment(
    @Param('id') CommentId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    return this.CommentService.deleteComment(CommentId);
  }

  @Get()
  async getComments(
    @Query('article_id') articleId: number,
  ): Promise<ResponseItem<CommentEntity>> {
    const faculties = await this.CommentService.getComments(articleId);

    return new ResponseItem(faculties, 'Get Comments Successfully');
  }
}

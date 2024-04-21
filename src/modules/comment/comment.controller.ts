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
import { CommentService } from './Comment.service';
import { CommentDto } from './dto/Comment.dto';
import { CreateCommentDto } from './dto/create.dto';
import { UpdateCommentDto } from './dto/update.dto';
import { CommentEntity } from './entities';

@Controller('Comments')
export class CommentController {
  constructor(private readonly CommentService: CommentService) {}

  @Get(':id')
  async getFalcuty(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseItem<CommentDto>> {
    return await this.CommentService.getComment(id);
  }

  @Post('/create')
  async createComment(
    @Body() createComment: CreateCommentDto,
  ): Promise<ResponseItem<CommentEntity>> {
    return this.CommentService.createComment(createComment);
  }

  @Patch('/update/:id')
  async updateFaculty(
    @Param('id') facultyId: number,
    @Body() updateFacultyDto: UpdateCommentDto,
  ): Promise<ResponseItem<CommentEntity>> {
    return this.CommentService.updateComment(facultyId, updateFacultyDto);
  }

  @Delete('/delete/:id')
  async deleteFaculty(
    @Param('id') CommentId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    return this.CommentService.deleteComment(CommentId);
  }

  @Get()
  async getComments(): Promise<ResponseItem<CommentEntity>> {
    const faculties = await this.CommentService.getComments();

    return new ResponseItem(faculties, 'Get Comments Successfully');
  }
}

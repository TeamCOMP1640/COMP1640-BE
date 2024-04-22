import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@UsersModule/entities';
import { FacultyEntity } from '../falcuties/entities';
import { CommentEntity } from './entities';
import { ResponseItem } from '@app/common/dtos';
import { CommentDto } from './dto/Comment.dto';
import { CreateCommentDto } from './dto/create.dto';
import { UpdateCommentDto } from './dto/update.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly CommentRepository: Repository<CommentEntity>,
  ) {}

  async getComment(id: number): Promise<ResponseItem<CommentDto>> {
    const Comment = await this.CommentRepository.findOne({
      where: {
        id,
      },
    });
    if (!Comment) throw new BadRequestException('Comment not exist');

    return new ResponseItem({ ...Comment }, 'Get Comment successfully');
  }

  async createComment(
    createCommentDto: CreateCommentDto,
  ): Promise<ResponseItem<CommentEntity>> {
    const newComment = this.CommentRepository.create(createCommentDto);
    this.CommentRepository.save(newComment);
    return new ResponseItem(newComment, 'Created Comment Successfully');
  }

  async updateComment(
    facultyId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<ResponseItem<CommentEntity>> {
    const Comment = await this.CommentRepository.findOneBy({ id: facultyId });
    if (!Comment) {
      throw new NotFoundException(`Comment with ID ${facultyId} not found`);
    }
    // if (updateCommentDto.year) Comment.year = updateCommentDto.year;
    // if (updateCommentDto.final_closure_date)
    //   Comment.final_closure_date = updateCommentDto.final_closure_date;

    this.CommentRepository.save(Comment);

    return new ResponseItem(Comment, 'Updated Comment Successfully');
  }

  async deleteComment(
    facultyId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    const faculty = await this.CommentRepository.findOneBy({ id: facultyId });
    if (!faculty) {
      throw new NotFoundException(`Comment with ID ${facultyId} not found`);
    }

    await this.CommentRepository.remove(faculty);
    return new ResponseItem({ id: facultyId }, 'Delete Comment Successfully');
  }

  async getComments(): Promise<CommentEntity[]> {
    return this.CommentRepository.find();
  }
}

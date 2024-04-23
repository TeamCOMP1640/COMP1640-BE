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
import { ArticleEntity } from '../article/entities';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly CommentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async getComment(
    articleId: number,
    userId: number,
  ): Promise<ResponseItem<CommentDto>> {
    const userFounded = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const articleFounded = await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
    });

    const Comment = await this.CommentRepository.findOne({
      where: {
        user: userFounded,
        article: articleFounded,
      },
    });
    if (!Comment) throw new BadRequestException('Comment not exist');

    return new ResponseItem({ ...Comment }, 'Get Comment successfully');
  }

  async checkIsCoordinatorComment(
    articleId: number,
    userId: number,
  ): Promise<ResponseItem<boolean>> {
    const userFounded = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const articleFounded = await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
    });

    const commentFound = await this.CommentRepository.findOne({
      where: {
        user: userFounded,
        article: articleFounded,
      },
    });

    return new ResponseItem(commentFound !== null, 'Check successfully');
  }

  async createComment(
    createCommentDto: CreateCommentDto,
  ): Promise<ResponseItem<CommentEntity>> {
    const newComment = this.CommentRepository.create(createCommentDto);
    const userFounded = await this.userRepository.findOne({
      where: {
        id: createCommentDto.user_id,
      },
    });

    const articleFounded = await this.articleRepository.findOne({
      where: {
        id: createCommentDto.article_id,
      },
    });
    newComment.article = articleFounded;
    newComment.user = userFounded;
    await this.CommentRepository.save(newComment);
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
    if (updateCommentDto.detail) Comment.detail = updateCommentDto.detail;
    // if (updateCommentDto.final_closure_date)
    //   Comment.final_closure_date = updateCommentDto.final_closure_date;

    await this.CommentRepository.save(Comment);

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

  async getComments(articleId?: number): Promise<CommentEntity[]> {
    return this.CommentRepository.find({
      where: { article: { id: articleId } },
      relations: ['article', 'user'],
    });
  }
}

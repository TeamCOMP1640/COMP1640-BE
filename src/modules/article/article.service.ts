import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseItem } from '@app/common/dtos';
import { ArticleDto } from './dto/Article.dto';
import { CreateArticleDto } from './dto/create.dto';
import { UpdateArticleDto } from './dto/update.dto';
import { ArticleEntity } from './entities';
import { MagazineEntity } from '../magazine/entities';
import { UserEntity } from '@UsersModule/entities';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly ArticleRepository: Repository<ArticleEntity>,
    @InjectRepository(MagazineEntity)
    private readonly magazineRepository: Repository<MagazineEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private cloudinary: CloudinaryService,
  ) {}

  async getArticle(id: number): Promise<ResponseItem<ArticleDto>> {
    const Article = await this.ArticleRepository.findOne({
      where: {
        id,
      },
    });
    if (!Article) throw new BadRequestException('Article not exist');

    return new ResponseItem({ ...Article }, 'Get Article successfully');
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
    file: Express.Multer.File,
  ): Promise<ResponseItem<ArticleEntity>> {
    const newArticle = this.ArticleRepository.create(createArticleDto);

    const magazineFounded = await this.magazineRepository.findOneBy({
      id: createArticleDto.magazine_id,
    });
    const userFounded = await this.userRepository.findOneBy({
      id: createArticleDto.user_id,
    });

    const result = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
    newArticle.image_url = result.secure_url;
    newArticle.magazine = magazineFounded;
    newArticle.user = userFounded;
    this.ArticleRepository.save(newArticle);
    return new ResponseItem(newArticle, 'Created Article Successfully');
  }

  async updateArticle(
    ArticleId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ResponseItem<ArticleEntity>> {
    const Article = await this.ArticleRepository.findOneBy({ id: ArticleId });
    if (!Article) {
      throw new NotFoundException(`Article with ID ${ArticleId} not found`);
    }
    if (updateArticleDto.title) Article.title = updateArticleDto.title;
    if (updateArticleDto.submitted_date)
      Article.submitted_date = updateArticleDto.submitted_date;

    this.ArticleRepository.save(Article);

    return new ResponseItem(Article, 'Updated Article Successfully');
  }

  async deleteArticle(
    ArticleId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    const Article = await this.ArticleRepository.findOneBy({ id: ArticleId });
    if (!Article) {
      throw new NotFoundException(`Article with ID ${ArticleId} not found`);
    }

    await this.ArticleRepository.remove(Article);
    return new ResponseItem({ id: ArticleId }, 'Delete Article Successfully');
  }

  async publicationArticle(
    ArticleId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    const Article = await this.ArticleRepository.findOneBy({ id: ArticleId });
    if (!Article) {
      throw new NotFoundException(`Article with ID ${ArticleId} not found`);
    }
    Article.status = 'Publication';

    await this.ArticleRepository.save(Article);
    return new ResponseItem(
      { id: ArticleId },
      'Publication Article Successfully',
    );
  }

  async getArticles(): Promise<ArticleEntity[]> {
    return this.ArticleRepository.find();
  }
}

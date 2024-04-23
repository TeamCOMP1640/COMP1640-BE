import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as mammoth from 'mammoth';
import { promises as fss } from 'fs';

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
    wold_file: Express.Multer.File,
  ): Promise<ResponseItem<ArticleEntity>> {
    const newArticle = this.ArticleRepository.create(createArticleDto);

    const magazineFounded = await this.magazineRepository.findOneBy({
      id: createArticleDto.magazine_id,
    });
    const userFounded = await this.userRepository.findOneBy({
      id: createArticleDto.user_id,
    });

    if (file) {
      const result = await this.cloudinary.uploadImage(file).catch(() => {
        throw new BadRequestException('Invalid file type.');
      });
      newArticle.image_url = result.secure_url;
    }

    if (wold_file) {
      const uploadDir = path.join(process.cwd(), './uploads/');

      // check if directory exists and if not, create it
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // `recursive: true` enables creation of parent directories
      }

      fs.writeFileSync(
        path.join(uploadDir, wold_file.originalname),
        wold_file.buffer,
      );

      newArticle.file_word_url = path.join(
        'http://localhost:8080/uploads/',
        wold_file.originalname,
      );
    }
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
    const article = await this.ArticleRepository.findOneBy({ id: ArticleId });
    if (!article) {
      throw new NotFoundException(`Article with ID ${ArticleId} not found`);
    }
    article.status = 'Publication';

    const wordFilePath = path.join(
      './uploads',
      article.file_word_url.split('/').pop(),
    );

    const contentBuffer = await fss.readFile(wordFilePath);
    const { value: textContent } = await mammoth.extractRawText({
      buffer: contentBuffer,
    });

    article.publication_content = textContent;

    await this.ArticleRepository.save(article);
    return new ResponseItem(
      { id: ArticleId },
      'Publication Article Successfully',
    );
  }

  async getArticles(): Promise<ArticleEntity[]> {
    return this.ArticleRepository.find();
  }

  async getArticlesPublication(): Promise<ArticleEntity[]> {
    return this.ArticleRepository.find({ where: { status: 'Publication' } });
  }

  async getArticleByStudent(
    studentId: number,
    magazineId: number,
  ): Promise<ResponseItem<ArticleEntity>> {
    const user = await this.userRepository.findOne({
      where: {
        id: studentId,
      },
    });

    const magazine = await this.magazineRepository.findOne({
      where: {
        id: magazineId,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${studentId} not found`);
    }

    const articles = await this.ArticleRepository.find({
      where: {
        user: user,
        magazine: magazine,
      },
      relations: ['user', 'magazine'],
    });

    return new ResponseItem(articles, 'Get Successfully');
  }

  async getArticleByMagazineId(
    magazineId: number,
  ): Promise<ResponseItem<ArticleEntity>> {
    const magazine = await this.magazineRepository.findOne({
      where: {
        id: magazineId,
      },
    });

    const articles = await this.ArticleRepository.find({
      where: {
        magazine: magazine,
      },
      relations: ['magazine'],
    });

    return new ResponseItem(articles, 'Get Successfully');
  }
}

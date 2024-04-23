import { UserEntity } from '@UsersModule/entities';
import { CommentEntity } from '@app/modules/comment/entities/comment.entity';
import { MagazineEntity } from '@app/modules/magazine/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'date', nullable: true })
  submitted_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_word_url: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  publication_content: string;

  @ManyToOne(() => MagazineEntity, (magazine) => magazine.articles)
  magazine: MagazineEntity;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: UserEntity[];
}

import { UserEntity } from '@UsersModule/entities';
import { ArticleEntity } from '@app/modules/article/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  detail: string;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;
}

import { UserEntity } from '@UsersModule/entities';
import { ArticleEntity } from '@app/modules/article/entities';

export class CommentDto {
  id: number;
  detail: string;
  user: UserEntity;
  article: ArticleEntity;
}

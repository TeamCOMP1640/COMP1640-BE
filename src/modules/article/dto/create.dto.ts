export class CreateArticleDto {
  title: string;
  submitted_date: Date;
  description: string;
  status: string;
  user_id: number;
  magazine_id: number;
  file: Express.Multer.File;
}

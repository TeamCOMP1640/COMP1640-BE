import { AcademicEntity } from '@app/modules/academic/entities';
import { ArticleEntity } from '@app/modules/article/entities';
import { FacultyEntity } from '@app/modules/falcuties/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('magazines')
export class MagazineEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'date' })
  closure_date: Date;

  @ManyToOne(() => FacultyEntity, (faculty) => faculty.magazines)
  faculty: FacultyEntity;

  @ManyToOne(() => AcademicEntity, (faculty) => faculty.magazines)
  academic: AcademicEntity;

  @OneToMany(() => ArticleEntity, (article) => article.magazine)
  articles: ArticleEntity[];
}

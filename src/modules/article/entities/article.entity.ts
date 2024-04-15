import { UserEntity } from '@UsersModule/entities';
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

  @ManyToOne(() => MagazineEntity, (magazine) => magazine.articles)
  magazine: MagazineEntity;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  user: UserEntity;
}

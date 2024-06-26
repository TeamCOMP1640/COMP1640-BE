import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FacultyEntity } from '@app/modules/falcuties/entities';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ArticleEntity } from '@app/modules/article/entities';
import { CommentEntity } from '@app/modules/comment/entities/comment.entity';

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  MARKETING_MANAGER = 'marketing_manager',
  MARKETING_COORDINATOR = 'marketing_coordinator',
  GUEST = 'guest',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  fullname: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @ManyToMany(() => FacultyEntity, (faculty) => faculty.users)
  @JoinTable()
  faculties: FacultyEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.user)
  articles: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

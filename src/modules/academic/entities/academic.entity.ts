import { UserEntity } from '@UsersModule/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('academics')
export class AcademicEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'number' })
  year: number;

  @Column({ type: 'date', nullable: true })
  final_closure_date: Date;
}

import { UserEntity } from '@UsersModule/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('faculties')
export class FacultyEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.faculties)
  users: UserEntity[];
}

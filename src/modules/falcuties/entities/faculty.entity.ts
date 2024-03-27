import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '@UsersModule/entities';

@Entity('faculties')
export class FacultyEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.faculties)
  users: UserEntity[];
}

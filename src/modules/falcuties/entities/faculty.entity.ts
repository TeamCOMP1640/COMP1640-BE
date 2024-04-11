import { UserEntity } from '@UsersModule/entities/user.entity';
import { MagazineEntity } from '@app/modules/magazine/entities';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('faculties')
export class FacultyEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  enrolment_key: string;

  @ManyToMany(() => UserEntity, (user) => user.faculties)
  users: UserEntity[];

  @OneToMany(() => MagazineEntity, (magazine) => magazine.faculty)
  magazines: MagazineEntity[];
}

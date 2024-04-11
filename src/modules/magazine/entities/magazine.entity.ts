import { FacultyEntity } from '@app/modules/falcuties/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('magazines')
export class MagazineEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'date' })
  closure_date: Date;

  @ManyToOne(() => FacultyEntity, (faculty) => faculty.magazines)
  faculty: FacultyEntity;
}

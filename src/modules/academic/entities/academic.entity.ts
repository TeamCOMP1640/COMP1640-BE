import { MagazineEntity } from '@app/modules/magazine/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('academics')
export class AcademicEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  year: string;

  @Column({ type: 'date', nullable: true })
  final_closure_date: Date;

  @OneToMany(() => MagazineEntity, (magazine) => magazine.faculty)
  magazines: MagazineEntity[];
}

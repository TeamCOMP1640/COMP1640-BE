import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('academics')
export class AcademicEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  year: string;

  @Column({ type: 'date', nullable: true })
  final_closure_date: Date;
}

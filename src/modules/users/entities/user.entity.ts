import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@Entity/abstract.entity';

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  MARKETING_MANAGER = 'marketing_manager',
  MARKETING_COORDINATOR = 'marketing_coordinator',
  GUEST = 'guest',
}

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 10 })
  phone: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;
}

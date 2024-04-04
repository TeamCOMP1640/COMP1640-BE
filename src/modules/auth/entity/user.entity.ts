// // user.entity.ts
// import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// export enum UserRole {
//   ADMIN = 'admin',
//   STUDENT = 'student',
//   MARKETING_MANAGER = 'marketing_manager',
//   MARKETING_COORDINATOR = 'marketing_coordinator',
//   GUEST = 'guest',
// }

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   username: string;

//   @Column()
//   password: string;

//   @Column({
//     type: 'enum',
//     enum: UserRole,
//     default: UserRole.GUEST,
//   })
//   role: UserRole;
// }

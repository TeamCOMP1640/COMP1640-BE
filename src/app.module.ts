// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from '@UsersModule/user.module';
import { FacultyModule } from './modules/falcuties/faculty.module';
import { UserEntity } from '@UsersModule/entities';
import { FacultyEntity } from './modules/falcuties/entities';
import { AcademicModule } from './modules/academic/academic.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'abcdef',
      database: 'comp1640',
      entities: [UserEntity, FacultyEntity],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    FacultyModule,
    AcademicModule,
  ],
})
export class AppModule {}

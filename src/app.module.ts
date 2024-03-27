// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entity/user.entity';
import { UsersModule } from '@UsersModule/user.module';
import { FacultyModule } from './modules/falcuties/faculty.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'abcdef',
      database: 'comp1640',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    FacultyModule,
  ],
})
export class AppModule {}

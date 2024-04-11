// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@UsersModule/user.module';
import { FacultyModule } from './modules/falcuties/faculty.module';
import { UserEntity } from '@UsersModule/entities';
import { FacultyEntity } from './modules/falcuties/entities';
import { AcademicModule } from './modules/academic/academic.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AcademicEntity } from './modules/academic/entities';
import { MagazineEntity } from './modules/magazine/entities';
import { MagazineModule } from './modules/magazine/magazine.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'abcdef',
      database: 'comp1640',
      entities: [UserEntity, FacultyEntity, AcademicEntity, MagazineEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    FacultyModule,
    AcademicModule,
    MagazineModule,
    JwtModule.register({
      secret: 'e#9BX@JxK^t68U2h',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AppModule {}

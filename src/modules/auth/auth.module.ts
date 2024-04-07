// auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';

import { UserEntity } from '@UsersModule/entities';
import { UsersService } from '@UsersModule/user.service';
import { FacultyService } from '@app/modules/falcuties/faculty.service';
import { FacultyEntity } from '@app/modules/falcuties/entities';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JsonWebTokenStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FacultyEntity]),
    JwtModule.register({
      secret: 'e#9BX@JxK^t68U2h',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, FacultyService, JsonWebTokenStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}

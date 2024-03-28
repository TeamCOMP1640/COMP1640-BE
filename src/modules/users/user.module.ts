import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';

import { UsersService } from './user.service';
import { JsonWebTokenStrategy } from '@app/auth/jwt/jwt.strategy';
import { UsersController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, JsonWebTokenStrategy],
  exports: [UsersService],
})
export class UsersModule {}

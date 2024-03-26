import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@UsersModule/entities/user.entity';
import { ResponseItem } from '@app/common/dtos';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUser(id: number): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new BadRequestException('Nhân viên không tồn tại');

    return new ResponseItem({ ...user }, 'Thành công');
  }
}

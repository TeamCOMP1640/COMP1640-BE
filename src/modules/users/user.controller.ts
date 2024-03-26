import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { ResponseItem } from '@app/common/dtos';

import { UserDto } from './dto/user.dto';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseItem<UserDto>> {
    return await this.usersService.getUser(id);
  }
}

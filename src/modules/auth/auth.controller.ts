import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '@UsersModule/user.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseItem } from '@app/common/dtos';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res() res,
  ) {
    try {
      await this.authService.register(username, password);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'User registered successfully' });
    } catch (error) {
      return res.status(HttpStatus.CONFLICT).json({ message: error.message });
    }
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    // @Res() res,
  ) {
    const user = await this.usersService.validateCredentials({
      username,
      password,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
    return new ResponseItem(
      {
        access_token: await this.jwtService.signAsync(payload),
        role: user.role,
        id: user.id,
        name: user.username,
      },
      `Login Successfully `,
    );
  }
}

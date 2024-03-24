import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    @Res() res,
  ) {
    try {
      const role = await this.authService.login(username, password);
      return res.status(HttpStatus.OK).json({ message: `Hello, ${role}` });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }
}

// jwt.config.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtConfig {
  public static readonly secret: string = 'your_secret_key_here';
}

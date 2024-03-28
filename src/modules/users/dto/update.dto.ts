import { UserRole } from '@UsersModule/entities';

export class UpdateUserDto {
  email?: string;

  fullname?: string;

  phone?: string;

  username?: string;

  password?: string;

  role?: UserRole;
}

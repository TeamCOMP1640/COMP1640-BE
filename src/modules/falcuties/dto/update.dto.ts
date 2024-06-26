import { UserDto } from '@UsersModule/dto/user.dto';

export class UpdateFacultyDto {
  name?: string;
  enrolment_key?: string;
  users?: UserDto[];
}

export class AssignStudentDto {
  enrolment_key?: string;
}

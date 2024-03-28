import { Controller } from '@nestjs/common';

import { AcademicService } from './academic.service';

@Controller('academics')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}
}

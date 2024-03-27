import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { ResponseItem } from '@app/common/dtos';

import { FacultyService } from './faculty.service';
import { FacultyDto } from './dto/faculty.dto';

@Controller('falcuties')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get(':id')
  async getFalcuty(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseItem<FacultyDto>> {
    return await this.facultyService.getFaculty(id);
  }
}

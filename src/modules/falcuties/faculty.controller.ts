import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ResponseItem } from '@app/common/dtos';

import { CreateFacultyDto } from './dto/create.dto';
import { FacultyDto } from './dto/faculty.dto';
import { UpdateFacultyDto } from './dto/update.dto';
import { FacultyEntity } from './entities';
import { FacultyService } from './faculty.service';

@Controller('faculties')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get(':id')
  async getFalcuty(
    @Param('id', ParseIntPipe) id: number,
    @Query('role') role?: string,
  ): Promise<ResponseItem<FacultyDto>> {
    return await this.facultyService.getFaculty(id, role);
  }

  @Post('/create')
  async createFaculty(
    @Body() createFacultyDto: CreateFacultyDto,
  ): Promise<ResponseItem<FacultyEntity>> {
    return this.facultyService.createFaculty(createFacultyDto);
  }

  @Patch('/update/:id')
  async updateFaculty(
    @Param('id') facultyId: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ): Promise<ResponseItem<FacultyEntity>> {
    return this.facultyService.updateFaculty(facultyId, updateFacultyDto);
  }

  @Delete('/delete/:id')
  async deleteFaculty(
    @Param('id') falcutyId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    return this.facultyService.deleteFaculty(falcutyId);
  }

  @Get()
  async getFaculties(): Promise<ResponseItem<FacultyEntity>> {
    const faculties = await this.facultyService.getFaculties();

    return new ResponseItem(faculties, 'Get Faculties Successfully');
  }

  @Post('/assign-marketingcoor/:id')
  async assignMarketingCoordinator(
    @Param('id') facultyId: number,
    @Param('userId') userId: number,
  ): Promise<ResponseItem<string>> {
    return this.facultyService.assignMarketingCoordinator(facultyId, userId);
  }

  @Post('/student/:id/:userId')
  async assignStudent(
    @Param('id') facultyId: number,
    @Param('userId') userId: number,
    @Body() enrolment_key: UpdateFacultyDto,
  ): Promise<ResponseItem<string>> {
    return this.facultyService.assignStudent(facultyId, userId, enrolment_key);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ResponseItem } from '@app/common/dtos';
import { AcademicService } from './academic.service';
import { AcademicDto } from './dto/academic.dto';
import { CreateAcademicDto } from './dto/create.dto';
import { AcademicEntity } from './entities';
import { UpdateAcademicDto } from './dto/update.dto';

@Controller('academics')
export class AcademicController {
  constructor(private readonly academicService: AcademicService) {}

  @Get(':id')
  async getFalcuty(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseItem<AcademicDto>> {
    return await this.academicService.getAcademic(id);
  }

  @Post('/create')
  async createAcademic(
    @Body() createAcademic: CreateAcademicDto,
  ): Promise<ResponseItem<AcademicEntity>> {
    return this.academicService.createAcademic(createAcademic);
  }

  @Patch('/update/:id')
  async updateFaculty(
    @Param('id') facultyId: number,
    @Body() updateFacultyDto: UpdateAcademicDto,
  ): Promise<ResponseItem<AcademicEntity>> {
    return this.academicService.updateFaculty(facultyId, updateFacultyDto);
  }

  @Delete('/delete/:id')
  async deleteFaculty(
    @Param('id') academicId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    return this.academicService.deleteAcademic(academicId);
  }

  @Get()
  async getAcademics(): Promise<ResponseItem<AcademicEntity>> {
    const faculties = await this.academicService.getAcademics();

    return new ResponseItem(faculties, 'Get Academics Successfully');
  }
}

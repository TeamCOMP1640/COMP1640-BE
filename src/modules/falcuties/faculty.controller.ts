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

import { FacultyService } from './faculty.service';
import { FacultyDto } from './dto/faculty.dto';
import { CreateUserDto } from '@UsersModule/dto/create.dto';
import { UpdateUserDto } from '@UsersModule/dto/update.dto';
import { UserEntity } from '@UsersModule/entities';
import { CreateFacultyDto } from './dto/create.dto';
import { FacultyEntity } from './entities';
import { UpdateFacultyDto } from './dto/update.dto';

@Controller('faculties')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get(':id')
  async getFalcuty(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseItem<FacultyDto>> {
    return await this.facultyService.getFaculty(id);
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
}

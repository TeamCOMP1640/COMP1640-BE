import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@UsersModule/entities';
import { FacultyEntity } from '../falcuties/entities';
import { AcademicEntity } from './entities';
import { ResponseItem } from '@app/common/dtos';
import { AcademicDto } from './dto/academic.dto';
import { CreateAcademicDto } from './dto/create.dto';
import { UpdateAcademicDto } from './dto/update.dto';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(AcademicEntity)
    private readonly academicRepository: Repository<AcademicEntity>,
  ) {}

  async getAcademic(id: number): Promise<ResponseItem<AcademicDto>> {
    const academic = await this.academicRepository.findOne({
      where: {
        id,
      },
    });
    if (!academic) throw new BadRequestException('Academic not exist');

    return new ResponseItem({ ...academic }, 'Get Academic successfully');
  }

  async createAcademic(
    createAcademicDto: CreateAcademicDto,
  ): Promise<ResponseItem<AcademicEntity>> {
    const newAcademic = this.academicRepository.create(createAcademicDto);
    this.academicRepository.save(newAcademic);
    return new ResponseItem(newAcademic, 'Created Academic Successfully');
  }

  async updateFaculty(
    facultyId: number,
    updateAcademicDto: UpdateAcademicDto,
  ): Promise<ResponseItem<AcademicEntity>> {
    const academic = await this.academicRepository.findOneBy({ id: facultyId });
    if (!academic) {
      throw new NotFoundException(`Academic with ID ${facultyId} not found`);
    }
    if (updateAcademicDto.year) academic.year = updateAcademicDto.year;
    if (updateAcademicDto.final_closure_date)
      academic.final_closure_date = updateAcademicDto.final_closure_date;

    this.academicRepository.save(academic);

    return new ResponseItem(academic, 'Updated Academic Successfully');
  }

  async deleteAcademic(
    facultyId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    const faculty = await this.academicRepository.findOneBy({ id: facultyId });
    if (!faculty) {
      throw new NotFoundException(`Academic with ID ${facultyId} not found`);
    }

    await this.academicRepository.remove(faculty);
    return new ResponseItem({ id: facultyId }, 'Delete Academic Successfully');
  }

  async getAcademics(): Promise<AcademicEntity[]> {
    return this.academicRepository.find();
  }
}

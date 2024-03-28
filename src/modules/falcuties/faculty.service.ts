import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseItem } from '@app/common/dtos';
import { FacultyEntity } from './entities';
import { FacultyDto } from './dto/faculty.dto';
import { CreateFacultyDto } from './dto/create.dto';
import { UpdateFacultyDto } from './dto/update.dto';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(FacultyEntity)
    private readonly facultyRepository: Repository<FacultyEntity>,
  ) {}

  async getFaculty(id: number): Promise<ResponseItem<FacultyDto>> {
    const user = await this.facultyRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new BadRequestException('Falcuty not exist');

    return new ResponseItem({ ...user }, 'Get Faculty successfully');
  }

  async createFaculty(
    createFacultyDto: CreateFacultyDto,
  ): Promise<ResponseItem<FacultyEntity>> {
    const newFaculty = this.facultyRepository.create(createFacultyDto);
    this.facultyRepository.save(newFaculty);
    return new ResponseItem(newFaculty, 'Created Faculty Successfully');
  }

  async updateFaculty(
    facultyId: number,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<ResponseItem<FacultyEntity>> {
    const faculty = await this.facultyRepository.findOneBy({ id: facultyId });
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }
    if (updateFacultyDto.name) faculty.name = updateFacultyDto.name;
    if (updateFacultyDto.enrolment_key)
      faculty.enrolment_key = updateFacultyDto.enrolment_key;

    this.facultyRepository.save(faculty);

    return new ResponseItem(faculty, 'Updated Faculty Successfully');
  }

  async deleteFaculty(
    facultyId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    const faculty = await this.facultyRepository.findOneBy({ id: facultyId });
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }

    await this.facultyRepository.remove(faculty);
    return new ResponseItem({ id: facultyId }, 'Delete Faculty Successfully');
  }

  async getFaculties(): Promise<FacultyEntity[]> {
    return this.facultyRepository.find();
  }
}

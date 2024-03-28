import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseItem } from '@app/common/dtos';
import { FacultyEntity } from './entities';
import { FacultyDto } from './dto/faculty.dto';

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
    if (!user) throw new BadRequestException('Khoa không tồn tại');

    return new ResponseItem({ ...user }, 'Thành công');
  }
}

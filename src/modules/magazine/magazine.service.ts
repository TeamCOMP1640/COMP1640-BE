import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseItem } from '@app/common/dtos';
import { MagazineEntity } from './entities';
import { MagazineDto } from './dto/Magazine.dto';
import { CreateMagazineDto } from './dto/create.dto';
import { UpdateMagazineDto } from './dto/update.dto';
import { UserEntity, UserRole } from '@UsersModule/entities';
import { FacultyEntity } from '../falcuties/entities';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(MagazineEntity)
    private readonly magazineRepository: Repository<MagazineEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FacultyEntity)
    private readonly facultyRepository: Repository<FacultyEntity>,
  ) {}

  async getMagazine(id: number): Promise<ResponseItem<MagazineDto>> {
    const user = await this.magazineRepository.findOne({
      where: {
        id,
      },
      relations: ['faculty'],
    });
    if (!user) throw new BadRequestException('Magazine not exist');

    return new ResponseItem({ ...user }, 'Get Magazine successfully');
  }

  async createMagazine(
    createMagazineDto: CreateMagazineDto,
  ): Promise<ResponseItem<MagazineEntity>> {
    const facultyFounded = await this.facultyRepository.findOneBy({
      id: createMagazineDto.faculty_id,
    });
    const newMagazine = this.magazineRepository.create(createMagazineDto);
    newMagazine.faculty = facultyFounded;
    this.magazineRepository.save(newMagazine);
    return new ResponseItem(newMagazine, 'Created Magazine Successfully');
  }

  async updateMagazine(
    MagazineId: number,
    updateMagazineDto: UpdateMagazineDto,
  ): Promise<ResponseItem<MagazineEntity>> {
    const Magazine = await this.magazineRepository.findOneBy({
      id: MagazineId,
    });
    const facultyFounded = await this.facultyRepository.findOneBy({
      id: updateMagazineDto.faculty_id,
    });
    Magazine.faculty = facultyFounded;
    if (!Magazine) {
      throw new NotFoundException(`Magazine with ID ${MagazineId} not found`);
    }
    if (updateMagazineDto.name) Magazine.name = updateMagazineDto.name;
    if (updateMagazineDto.description)
      Magazine.description = updateMagazineDto.description;
    if (updateMagazineDto.closure_date)
      Magazine.closure_date = updateMagazineDto.closure_date;

    this.magazineRepository.save(Magazine);

    return new ResponseItem(Magazine, 'Updated Magazine Successfully');
  }

  async deleteMagazine(
    MagazineId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    const Magazine = await this.magazineRepository.findOneBy({
      id: MagazineId,
    });
    if (!Magazine) {
      throw new NotFoundException(`Magazine with ID ${MagazineId} not found`);
    }

    await this.magazineRepository.remove(Magazine);
    return new ResponseItem({ id: MagazineId }, 'Delete Magazine Successfully');
  }

  async getMagazines(): Promise<MagazineEntity[]> {
    return this.magazineRepository.find({ relations: ['faculty'] });
  }
}

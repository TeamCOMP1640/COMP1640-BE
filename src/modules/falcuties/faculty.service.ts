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
import { UserEntity, UserRole } from '@UsersModule/entities';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(FacultyEntity)
    private readonly facultyRepository: Repository<FacultyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getFaculty(id: number): Promise<ResponseItem<FacultyDto>> {
    const user = await this.facultyRepository.findOne({
      where: {
        id,
      },
      relations: ['users'],
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
    const faculty = await this.facultyRepository.findOne({
      where: {
        id: facultyId,
      },
      relations: ['users'],
    });
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }
    if (updateFacultyDto.name) faculty.name = updateFacultyDto.name;
    if (updateFacultyDto.enrolment_key)
      faculty.enrolment_key = updateFacultyDto.enrolment_key;
    if (updateFacultyDto.users) {
      const marketing_coordinator = await Promise.all(
        updateFacultyDto.users.map(async (user) => {
          const userFound = await this.userRepository.findOneBy({
            id: user.id,
          });
          return userFound;
        }),
      );
      faculty.users.push(...marketing_coordinator);
    }

    this.facultyRepository.save(faculty);

    return new ResponseItem(faculty, 'Updated Faculty Successfully');
  }

  async deleteFaculty(
    facultyId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    const faculty = await this.facultyRepository.findOne({
      where: {
        id: facultyId,
      },
      relations: ['users'],
    });
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }
    if (faculty.users.length > 0) {
      throw new NotFoundException(`Cannot delete faculty have user`);
    }

    await this.facultyRepository.remove(faculty);
    return new ResponseItem({ id: facultyId }, 'Delete Faculty Successfully');
  }

  async getFaculties(): Promise<FacultyEntity[]> {
    return this.facultyRepository.find({ relations: ['users'] });
  }

  async assignMarketingCoordinator(
    facultyId: number,
    userId: number,
  ): Promise<ResponseItem<string>> {
    const faculty = await this.facultyRepository.findOne({
      where: {
        id: facultyId,
      },
      relations: ['users'],
    });
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.role != UserRole.MARKETING_COORDINATOR) {
      throw new NotFoundException(
        `User with ID ${userId} are not marketing coordinator`,
      );
    }
    faculty.users = faculty.users || [];
    faculty.users.push(user);

    await this.facultyRepository.save(faculty);

    return new ResponseItem(
      null,
      `Assign User ${userId} to the faculty successfully  `,
    );
  }

  async assignStudent(
    facultyId: number,
    userId: number,
    enrolment_key: UpdateFacultyDto,
  ): Promise<ResponseItem<string>> {
    const faculty = await this.facultyRepository.findOne({
      where: {
        id: facultyId,
      },
      relations: ['users'],
    });
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.role != UserRole.STUDENT) {
      throw new NotFoundException(`User with ID ${userId} are not student`);
    }

    if (enrolment_key.enrolment_key !== faculty.enrolment_key) {
      throw new NotFoundException(
        `Wrong ${enrolment_key} enrolment key, please enter again`,
      );
    }
    const users = faculty.users || [];
    users.push(user);
    faculty.users = users;

    await this.facultyRepository.save(faculty);

    return new ResponseItem(
      null,
      `Assign User ${userId} to the faculty successfully  `,
    );
  }
}

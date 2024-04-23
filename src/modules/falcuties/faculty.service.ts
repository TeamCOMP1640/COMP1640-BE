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

  async getFaculty(
    id: number,
    role: string,
  ): Promise<ResponseItem<FacultyDto>> {
    const faculty = await this.facultyRepository.findOneBy({ id });
    // Check if faculty exists
    if (!faculty) throw new BadRequestException('Faculty does not exist');

    // If role is provided, find users with the given role.
    if (role) {
      // Retrieve users based on role
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.faculties', 'faculty')
        .where('user.role = :role', {
          role: UserRole[role.toUpperCase() as keyof typeof UserRole],
        })
        .andWhere('faculty.id = :id', { id: faculty.id })
        .getMany();

      if (users && users.length > 0) {
        faculty.users = users;
      }
      // If we have users with the given role, attach them to the faculty.
      if (users && users.length > 0) {
        faculty.users = users;
      }
    }

    return new ResponseItem({ ...faculty }, 'Get Faculty successfully');
  }

  async createFaculty(
    createFacultyDto: CreateFacultyDto,
  ): Promise<ResponseItem<FacultyEntity>> {
    const newFaculty = this.facultyRepository.create(createFacultyDto);
    await this.facultyRepository.save(newFaculty);
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
    if (updateFacultyDto.users || updateFacultyDto.guests) {
      faculty.users = [];
      await this.facultyRepository.save(faculty);
      const { users, guests } = updateFacultyDto;
      const totalUser = [...users, ...guests];
      const marketing_coordinator = await Promise.all(
        totalUser.map(async (user) => {
          const userFound = await this.userRepository.findOneBy({
            id: Number(user),
          });
          return userFound;
        }),
      );
      faculty.users.push(...marketing_coordinator);
    }

    await this.facultyRepository.save(faculty);

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

  async getDashboardFaculty(): Promise<any> {
    const faculties = await this.facultyRepository
      .createQueryBuilder('faculty')
      .leftJoin('faculty.magazines', 'magazine')
      .leftJoin('magazine.articles', 'article')
      .groupBy('faculty.id')
      .addSelect('COUNT(article.id)', 'article_count')
      .getRawMany();

    return faculties.map((faculty) => ({
      ...faculty,
      article_count: parseInt(faculty.article_count, 10),
    }));
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

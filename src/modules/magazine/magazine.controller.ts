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

import { CreateMagazineDto } from './dto/create.dto';
import { MagazineDto } from './dto/Magazine.dto';
import { UpdateMagazineDto } from './dto/update.dto';
import { MagazineEntity } from './entities';
import { MagazineService } from './magazine.service';

@Controller('magazines')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Get(':id')
  async getMagazine(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseItem<MagazineDto>> {
    return await this.magazineService.getMagazine(id);
  }

  @Post('/create')
  async createMagazine(
    @Body() createMagazineDto: CreateMagazineDto,
  ): Promise<ResponseItem<MagazineEntity>> {
    return this.magazineService.createMagazine(createMagazineDto);
  }

  @Patch('/update/:id')
  async updateMagazine(
    @Param('id') MagazineId: number,
    @Body() updateMagazineDto: UpdateMagazineDto,
  ): Promise<ResponseItem<MagazineEntity>> {
    return this.magazineService.updateMagazine(MagazineId, updateMagazineDto);
  }

  @Delete('/delete/:id')
  async deleteMagazine(
    @Param('id') falcutyId: number,
  ): Promise<ResponseItem<{ id: number }>> {
    return this.magazineService.deleteMagazine(falcutyId);
  }

  @Get()
  async getMagazines(): Promise<ResponseItem<MagazineEntity>> {
    const Magazines = await this.magazineService.getMagazines();

    return new ResponseItem(Magazines, 'Get Magazines Successfully');
  }
}

/* eslint-disable @typescript-eslint/unbound-method */
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  NotFoundException,
  Query,
} from '@nestjs/common';

import { CreatePatientsUseCase } from '@patients/application/use-cases/create-patients.use-case';
import { GetAllPatientsUseCase } from '@patients/application/use-cases/get-all-patients.use-case';
import { GetPatientsByIdUseCase } from '@patients/application/use-cases/get-patients-by-id.use-case';
import { UpdatePatientsUseCase } from '@patients/application/use-cases/update-patients.use-case';
import { CreatePatientsDto } from '@patients/application/dtos/create-patients.dto';
import { PatientsResponseDto } from '@patients/application/dtos/patients-response.dto';
import { UpdatePatientsDto } from '@patients/application/dtos/update-patients.dto';

@Controller('patients')
export class FoodsController {
  constructor(
    private readonly createPatientsUseCase: CreatePatientsUseCase,
    private readonly getAllPatientsUseCase: GetAllPatientsUseCase,
    private readonly getPatientsByIdUseCase: GetPatientsByIdUseCase,
    private readonly updatePatientsUseCase: UpdatePatientsUseCase,
  ) { }

  @Get()
  async getFoods(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{
    data: PatientsResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.getAllPatientsUseCase.execute(
      Number(page),
      Number(limit),
    );
    return {
      ...result,
      data: result.data.map(PatientsResponseDto.fromDomain),
    };
  }

  @Post()
  async createFoods(@Body() dto: CreatePatientsDto): Promise<PatientsResponseDto> {
    const foods = await this.createPatientsUseCase.execute(dto);
    return PatientsResponseDto.fromDomain(foods);
  }

  @Get(':id')
  async getFoodsById(
    @Param('id') id: string,
  ): Promise<PatientsResponseDto | null> {
    const foods = await this.getPatientsByIdUseCase.execute(id);
    return foods ? PatientsResponseDto.fromDomain(foods) : null;
  }

  @Patch(':id')
  async updateFoods(
    @Param('id') id: string,
    @Body() body: UpdatePatientsDto,
  ): Promise<PatientsResponseDto> {
    const foods = await this.updatePatientsUseCase.execute(id, body);

    if (!foods) {
      throw new NotFoundException(`Food with id ${id} not found`);
    }

    return PatientsResponseDto.fromDomain(foods);
  }
}

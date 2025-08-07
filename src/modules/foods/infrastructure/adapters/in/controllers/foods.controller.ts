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

import { CreateFoodsUseCase } from '@foods/application/use-cases/create-foods.use-case';
import { GetAllFoodsUseCase } from '@foods/application/use-cases/get-all-foods.use-case';
import { GetFoodsByIdUseCase } from '@foods/application/use-cases/get-foods-by-id.use-case';
import { UpdateFoodsUseCase } from '@foods/application/use-cases/update-foods.use-case';
import { CreateFoodsDto } from '@foods/application/dtos/create-foods.dto';
import { FoodsResponseDto } from '@foods/application/dtos/foods-response.dto';
import { UpdateFoodsDto } from '@foods/application/dtos/update-foods.dto';

@Controller('foods')
export class FoodsController {
  constructor(
    private readonly createFoodUseCase: CreateFoodsUseCase,
    private readonly getAllFoodsUseCase: GetAllFoodsUseCase,
    private readonly getFoodByIdUseCase: GetFoodsByIdUseCase,
    private readonly updateFoodUseCase: UpdateFoodsUseCase,
  ) { }

  @Get()
  async getFoods(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{
    data: FoodsResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.getAllFoodsUseCase.execute(
      Number(page),
      Number(limit),
    );
    return {
      ...result,
      data: result.data.map(FoodsResponseDto.fromDomain),
    };
  }

  @Post()
  async createFoods(@Body() dto: CreateFoodsDto): Promise<FoodsResponseDto> {
    const foods = await this.createFoodUseCase.execute(dto);
    return FoodsResponseDto.fromDomain(foods);
  }

  @Get(':id')
  async getFoodsById(
    @Param('id') id: string,
  ): Promise<FoodsResponseDto | null> {
    const foods = await this.getFoodByIdUseCase.execute(id);
    return foods ? FoodsResponseDto.fromDomain(foods) : null;
  }

  @Patch(':id')
  async updateFoods(
    @Param('id') id: string,
    @Body() body: UpdateFoodsDto,
  ): Promise<FoodsResponseDto> {
    const foods = await this.updateFoodUseCase.execute(id, body);

    if (!foods) {
      throw new NotFoundException(`Food with id ${id} not found`);
    }

    return FoodsResponseDto.fromDomain(foods);
  }
}

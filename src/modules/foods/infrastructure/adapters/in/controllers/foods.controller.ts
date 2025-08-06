import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';

import { CreateFoodsUseCase } from '../../../../application/use-cases/create-foods.use-case';
import { GetAllFoodsUseCase } from '../../../../application/use-cases/get-all-foods.use-case';
import { GetFoodsByIdUseCase } from '../../../../application/use-cases/get-foods-by-id.use-case';
import { Foods } from '../../../../domain/entities/foods.entity';
import { UpdateFoodsUseCase } from 'src/modules/foods/application/use-cases/update-foods.use-case';
import { CreateFoodsDto } from 'src/modules/foods/application/dtos/create-foods.dto';
import { CreatedFoodsDto } from 'src/modules/foods/application/dtos/created-foods.dto';
import { UpdateFoodsDto } from 'src/modules/foods/application/dtos/update-foods.dto';

@Controller('foods')
export class FoodsController {
  constructor(
    private readonly createFoodUseCase: CreateFoodsUseCase,
    private readonly getAllFoodsUseCase: GetAllFoodsUseCase,
    private readonly getFoodByIdUseCase: GetFoodsByIdUseCase,
    private readonly updateFoodUseCase: UpdateFoodsUseCase,
  ) {}

  // TODO: hacer paginacion y filtros
  @Get()
  async getFoods(): Promise<Foods[] | null> {
    return this.getAllFoodsUseCase.execute();
  }

  @Post()
  async createFoods(@Body() dto: CreateFoodsDto): Promise<CreatedFoodsDto> {
    console.log(dto);
    if (
      !dto.name ||
      !dto.carbs ||
      !dto.proteins ||
      !dto.fats ||
      !dto.calories
    ) {
      throw new Error('Missing required fields');
    }
    const created = await this.createFoodUseCase.execute(dto);
    return CreatedFoodsDto.fromDomain(created);
  }

  @Get(':id')
  async getFoodsById(@Param('id') id: string): Promise<Foods | null> {
    return this.getFoodByIdUseCase.execute(id);
  }

  @Patch(':id')
  async updateFoods(
    @Param('id') id: string,
    @Body() body: UpdateFoodsDto,
  ): Promise<CreatedFoodsDto> {
    const updated = await this.updateFoodUseCase.execute(id, body);
    return CreatedFoodsDto.fromDomain(updated);
  }
}

import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';

import { CreateFoodUseCase } from '../../../../application/use-cases/create-foods.use-case';
import { GetAllFoodsUseCase } from '../../../../application/use-cases/get-all-foods.use-case';
import { GetFoodByIdUseCase } from '../../../../application/use-cases/get-food-by-id.use-case';
import { Foods } from '../../../../domain/entities/foods.entity';
import { CreateFoodDto } from 'src/modules/food/application/dtos/create-food.dto';
import { UpdateFoodDto } from 'src/modules/food/application/dtos/update-food.dto';
import { FoodResponseDto } from 'src/modules/food/application/dtos/food-response.dto';
import { UpdateFoodUseCase } from 'src/modules/food/application/use-cases/update-foods.use-case';

@Controller('foods')
export class FoodsController {
  constructor(
    private readonly createFoodUseCase: CreateFoodUseCase,
    private readonly getAllFoodsUseCase: GetAllFoodsUseCase,
    private readonly getFoodByIdUseCase: GetFoodByIdUseCase,
    private readonly updateFoodUseCase: UpdateFoodUseCase,
  ) {}

  // TODO: hacer paginacion y filtros
  @Get()
  async getFoods(): Promise<Foods[] | null> {
    return this.getAllFoodsUseCase.execute();
  }

  @Post()
  async createFood(@Body() dto: CreateFoodDto): Promise<Foods> {
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
    return FoodResponseDto.fromDomain(created);
  }

  @Get(':id')
  async getFoodById(@Param('id') id: string): Promise<Foods | null> {
    return this.getFoodByIdUseCase.execute(id);
  }

  @Patch(':id')
  async updateFood(
    @Param('id') id: string,
    @Body() body: UpdateFoodDto,
  ): Promise<FoodResponseDto> {
    const updated = await this.updateFoodUseCase.execute(id, body);
    return FoodResponseDto.fromDomain(updated);
  }
}

import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';

import { CreateFoodCategoriesUseCase } from '../../../../application/use-cases/create-food-categories.use-case';
import { GetAllFoodCategoriesUseCase } from '../../../../application/use-cases/get-all-food-categories.use-case';
import { GetFoodCategoriesByIdUseCase } from '../../../../application/use-cases/get-food-categories-by-id.use-case';
import { FoodCategories } from '../../../../domain/entities/food-categories.entity';
import { UpdateFoodCategoriesUseCase } from '../../../../application/use-cases/update-food-categories.use-case';
import { CreateFoodCategoriesDto } from '../../../../application/dtos/create-food-categories.dto';
import { ResponseFoodCategoriesDto } from '../../../../application/dtos/response-food-categories.dto';
import { UpdateFoodCategoriesDto } from '../../../../application/dtos/update-food-categories.dto';

@Controller('food-categories')
export class FoodCategoriesController {
  constructor(
    private readonly createFoodCategoriesUseCase: CreateFoodCategoriesUseCase,
    private readonly getAllFoodCategoriesUseCase: GetAllFoodCategoriesUseCase,
    private readonly getFoodCategoriesByIdUseCase: GetFoodCategoriesByIdUseCase,
    private readonly updateFoodCategoriesUseCase: UpdateFoodCategoriesUseCase,
  ) {}

  @Get()
  async getFoodCategories(): Promise<FoodCategories[] | null> {
    return this.getAllFoodCategoriesUseCase.execute();
  }

  @Post()
  async createFoodCategories(
    @Body() dto: CreateFoodCategoriesDto,
  ): Promise<FoodCategories> {
    if (!dto.name || !dto.description) {
      throw new Error('Missing required fields');
    }
    const created = await this.createFoodCategoriesUseCase.execute(dto);
    return ResponseFoodCategoriesDto.fromDomain(created);
  }

  @Get(':id')
  async getFoodById(@Param('id') id: string): Promise<FoodCategories | null> {
    return this.getFoodCategoriesByIdUseCase.execute(id);
  }

  @Patch(':id')
  async updateFood(
    @Param('id') id: string,
    @Body() body: UpdateFoodCategoriesDto,
  ): Promise<ResponseFoodCategoriesDto> {
    const updated = await this.updateFoodCategoriesUseCase.execute(id, body);
    return ResponseFoodCategoriesDto.fromDomain(updated);
  }
}

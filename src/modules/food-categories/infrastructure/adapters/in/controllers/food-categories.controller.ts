import { Controller, Get, Param, Post, Body, Patch, Query } from '@nestjs/common';

import { CreateFoodCategoriesUseCase } from '@foodCategories/application/use-cases/create-food-categories.use-case';
import { GetAllFoodCategoriesUseCase } from '@foodCategories/application/use-cases/get-all-food-categories.use-case';
import { GetFoodCategoriesByIdUseCase } from '@foodCategories/application/use-cases/get-food-categories-by-id.use-case';
import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';
import { UpdateFoodCategoriesUseCase } from '@foodCategories/application/use-cases/update-food-categories.use-case';
import { CreateFoodCategoriesDto } from '@foodCategories/application/dtos/create-food-categories.dto';
import { ResponseFoodCategoriesDto } from '@foodCategories/application/dtos/response-food-categories.dto';
import { UpdateFoodCategoriesDto } from '@foodCategories/application/dtos/update-food-categories.dto';

@Controller('food-categories')
export class FoodCategoriesController {
  constructor(
    private readonly createFoodCategoriesUseCase: CreateFoodCategoriesUseCase,
    private readonly getAllFoodCategoriesUseCase: GetAllFoodCategoriesUseCase,
    private readonly getFoodCategoriesByIdUseCase: GetFoodCategoriesByIdUseCase,
    private readonly updateFoodCategoriesUseCase: UpdateFoodCategoriesUseCase,
  ) { }

  @Get()
  async getFoodCategories(
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ): Promise<{
    data: ResponseFoodCategoriesDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const result = await this.getAllFoodCategoriesUseCase.execute(
      Number(page),
      Number(limit),
    );
    return {
      ...result,
      data: result.data.map(ResponseFoodCategoriesDto.fromDomain),
    };
  }

  @Post()
  async createFoodCategories(
    @Body() dto: CreateFoodCategoriesDto,
  ): Promise<ResponseFoodCategoriesDto> {
    const created = await this.createFoodCategoriesUseCase.execute(dto);
    return ResponseFoodCategoriesDto.fromDomain(created);
  }

  @Get(':id')
  async getFoodCategoriesById(@Param('id') id: string): Promise<ResponseFoodCategoriesDto | null> {
    const foodcategories = await this.getFoodCategoriesByIdUseCase.execute(id);
    return foodcategories ? ResponseFoodCategoriesDto.fromDomain(foodcategories) : null;
  }

  @Patch(':id')
  async updateFoodCategoriesById(
    @Param('id') id: string,
    @Body() body: UpdateFoodCategoriesDto,
  ): Promise<ResponseFoodCategoriesDto> {
    const updated = await this.updateFoodCategoriesUseCase.execute(id, body);

    if (!updated) {
      throw new Error(`Food category with id ${id} not found`);
    }

    return ResponseFoodCategoriesDto.fromDomain(updated);
  }
}

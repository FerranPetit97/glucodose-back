import { Inject, Injectable } from '@nestjs/common';

import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '@foodCategories/domain/repositories/food-categories.repository';
import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';

import { CreateFoodCategoriesDto } from '../dtos/create-food-categories.dto';

@Injectable()
export class CreateFoodCategoriesUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
  ) { }

  async execute(dto: CreateFoodCategoriesDto): Promise<FoodCategories> {
    const category = FoodCategories.create(dto.name, dto.description);
    return await this.foodCategoriesRepository.save(category);
  }
}

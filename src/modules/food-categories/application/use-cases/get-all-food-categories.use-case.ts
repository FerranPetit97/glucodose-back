import { Inject, Injectable } from '@nestjs/common';
import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';
import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '@foodCategories/domain/repositories/food-categories.repository';

@Injectable()
export class GetAllFoodCategoriesUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
  ) { }

  async execute(
    page = 1,
    limit = 10
  ): Promise<{ data: FoodCategories[]; total: number; page: number; limit: number }> {
    return this.foodCategoriesRepository.findAll(page, limit);
  }
}

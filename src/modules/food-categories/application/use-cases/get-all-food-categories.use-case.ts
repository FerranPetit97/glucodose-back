import { Inject, Injectable } from '@nestjs/common';
import { FoodCategories } from '../../domain/entities/food-categories.entity';
import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '../../domain/repositories/food-categories.repository';

@Injectable()
export class GetAllFoodCategoriesUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
  ) {}

  async execute(): Promise<FoodCategories[] | []> {
    return this.foodCategoriesRepository.findAll();
  }
}

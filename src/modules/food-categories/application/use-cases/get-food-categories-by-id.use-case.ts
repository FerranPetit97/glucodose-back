import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FoodCategories } from '../../domain/entities/food-categories.entity';
import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '../../domain/repositories/food-categories.repository';

@Injectable()
export class GetFoodCategoriesByIdUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
  ) {}

  async execute(id: string): Promise<FoodCategories> {
    const category = await this.foodCategoriesRepository.findById(id);
    if (!category) throw new NotFoundException(`Foods with ID ${id} not found`);
    return category;
  }
}

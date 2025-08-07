import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';
import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '@foodCategories/domain/repositories/food-categories.repository';
import { ResponseFoodCategoriesDto } from '../dtos/response-food-categories.dto';

@Injectable()
export class GetFoodCategoriesByIdUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
  ) { }

  async execute(id: string): Promise<FoodCategories | null> {
    const category = await this.foodCategoriesRepository.findById(id);
    if (!category) throw new NotFoundException(`Foods with ID ${id} not found`);
    return category;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';
import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '@foodCategories/domain/repositories/food-categories.repository';
import { FoodCategoryNotFoundError } from '../../../../common/errors/domain-error';

@Injectable()
export class GetFoodCategoriesByIdUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
  ) { }

  async execute(id: string): Promise<FoodCategories> {
    const category = await this.foodCategoriesRepository.findById(id);
    if (!category) {
      throw new FoodCategoryNotFoundError(id);
    }
    return category;
  }
}

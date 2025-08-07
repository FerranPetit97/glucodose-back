import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '@foodCategories/domain/repositories/food-categories.repository';
import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';
import { UpdateFoodCategoriesDto } from '../dtos/update-food-categories.dto';

@Injectable()
export class UpdateFoodCategoriesUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
  ) { }

  async execute(
    id: string,
    dto: UpdateFoodCategoriesDto,
  ): Promise<FoodCategories> {
    const existing = await this.foodCategoriesRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    const updated = FoodCategories.fromPersistence(
      id,
      dto.name ?? existing.name,
      dto.description ?? existing.description,
    );

    await this.foodCategoriesRepository.save(updated);
    return updated;
  }
}

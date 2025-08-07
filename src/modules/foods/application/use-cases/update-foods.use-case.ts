import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FOODS_REPOSITORY,
  FoodsRepository,
} from '@foods/domain/repositories/foods.repository';
import { Foods } from '@foods/domain/entities/foods.entity';
import {
  FOOD_CATEGORY_MAPPINGS_REPOSITORY,
  FoodCategoryMappingsRepository,
} from '@foodCategoryMappings/domain/repositories/food-category-mappings.repository';
import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '@foodCategories/domain/repositories/food-categories.repository';
import { FoodCategoryMappings } from '@foodCategoryMappings/domain/entities/food-category-mappings.entity';
import { UpdateFoodsDto } from '../dtos/update-foods.dto';

@Injectable()
export class UpdateFoodsUseCase {
  constructor(
    @Inject(FOODS_REPOSITORY)
    private readonly foodsRepository: FoodsRepository,
    @Inject(FOOD_CATEGORY_MAPPINGS_REPOSITORY)
    private readonly foodCategoryMappingsRepository: FoodCategoryMappingsRepository,
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
  ) { }

  async execute(id: string, dto: UpdateFoodsDto): Promise<Foods> {
    const existing = await this.foodsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Food with id ${id} not found`);
    }

    const updated = await this.foodsRepository.updateById(id, dto);

    if (!dto.categoriesIds) {
      updated.setCategories([]);
      await this.foodCategoryMappingsRepository.deleteByFoodId(id);
      return updated;
    }

    const currentMappings = await this.foodCategoryMappingsRepository.findByFoodId(id);
    const currentCategoryIds = currentMappings.map(m => m.category_id);

    for (const categoryId of dto.categoriesIds) {
      if (!currentCategoryIds.includes(categoryId)) {
        const category = await this.foodCategoriesRepository.findById(categoryId);
        if (!category?.id) {
          throw new Error(`Category not found or missing ID: ${categoryId}`);
        }
        const mapping = FoodCategoryMappings.create(id, category.id);
        await this.foodCategoryMappingsRepository.save(mapping);
      }
    }

    for (const oldCategoryId of currentCategoryIds) {
      if (!dto.categoriesIds.includes(oldCategoryId)) {
        await this.foodCategoryMappingsRepository.delete(id, oldCategoryId);
      }
    }

    updated.setCategories(dto.categoriesIds);
    return updated;
  }
}

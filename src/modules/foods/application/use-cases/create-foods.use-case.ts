import { Inject, Injectable } from '@nestjs/common';
import {
  FOODS_REPOSITORY,
  FoodsRepository,
} from '../../domain/repositories/foods.repository';
import { Foods } from '../../domain/entities/foods.entity';
import { CreateFoodsDto } from '../dtos/create-foods.dto';
import { FoodCategoryMappings } from 'src/modules/food-category-mappings/domain/entities/food-category-mappings.entity';
import {
  FOOD_CATEGORY_MAPPINGS_REPOSITORY,
  FoodCategoryMappingsRepository,
} from 'src/modules/food-category-mappings/domain/repositories/food-category-mappings.repository';
import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from 'src/modules/food-categories/domain/repositories/food-categories.repository';

@Injectable()
export class CreateFoodsUseCase {
  constructor(
    @Inject(FOODS_REPOSITORY)
    private readonly foodsRepository: FoodsRepository,

    @Inject(FOOD_CATEGORY_MAPPINGS_REPOSITORY)
    private readonly foodCategoryMappingsRepository: FoodCategoryMappingsRepository,

    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
  ) {}

  async execute(dto: CreateFoodsDto): Promise<Foods> {
    console.log(dto);
    const food = Foods.create(
      dto.name,
      dto.carbs,
      dto.proteins,
      dto.fats,
      dto.calories,
    );

    const savedFood = await this.foodsRepository.save(food);

    if (!dto.categoriesIds?.length) {
      savedFood.setCategories([]);
      return savedFood;
    }

    const categoryNames: string[] = [];

    for (const categoryId of dto.categoriesIds) {
      const category = await this.foodCategoriesRepository.findById(categoryId);

      if (!category?.id) {
        throw new Error(`Category not found or missing ID: ${categoryId}`);
      }

      const mapping = FoodCategoryMappings.create(savedFood.id!, category.id);
      await this.foodCategoryMappingsRepository.save(mapping);
      categoryNames.push(category.name);
    }

    savedFood.setCategories(categoryNames);
    return savedFood;
  }
}

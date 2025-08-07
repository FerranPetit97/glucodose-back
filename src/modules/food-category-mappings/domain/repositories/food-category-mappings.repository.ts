import { FoodCategoryMappings } from '../entities/food-category-mappings.entity';

export const FOOD_CATEGORY_MAPPINGS_REPOSITORY = Symbol(
  'FoodCategoryMappingsRepository',
);

export interface FoodCategoryMappingsRepository {
  save(item: FoodCategoryMappings): Promise<void>;
  findByFoodId(foodId: string): Promise<FoodCategoryMappings[]>;
  deleteByFoodId(foodId: string): Promise<void>;
  delete(foodId: string, categoryId: string): Promise<void>;
}
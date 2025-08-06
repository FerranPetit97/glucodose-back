import { FoodCategories } from '../entities/food-categories.entity';

export const FOOD_CATEGORIES_REPOSITORY = Symbol('FoodCategoriesRepository');

export interface FoodCategoriesRepository {
  findAll(): Promise<FoodCategories[] | []>;
  findById(id: string): Promise<FoodCategories | null>;
  save(foodCategories: FoodCategories): Promise<FoodCategories>;
}

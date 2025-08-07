import { FoodCategories } from '../entities/food-categories.entity';
import { CreateFoodCategoriesDto } from '../../application/dtos/create-food-categories.dto';

export const FOOD_CATEGORIES_REPOSITORY = Symbol('FoodCategoriesRepository');

export interface FoodCategoriesRepository {
  findAll(page?: number, limit?: number): Promise<{ data: FoodCategories[]; total: number; page: number; limit: number }>;
  findById(id: string): Promise<FoodCategories | null>;
  findByName(name: string): Promise<FoodCategories | null>;
  save(foodCategories: CreateFoodCategoriesDto): Promise<FoodCategories>;
}

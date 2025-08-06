import { Foods } from '../entities/foods.entity';

export const FOODS_REPOSITORY = Symbol('FoodsRepository');

export interface FoodsRepository {
  findAll(): Promise<Foods[] | []>;
  findById(id: string): Promise<Foods | null>;
  save(foods: Foods): Promise<Foods>;
}

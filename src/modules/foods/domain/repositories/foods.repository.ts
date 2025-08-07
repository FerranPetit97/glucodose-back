import { CreateFoodsDto } from '@foods/application/dtos/create-foods.dto';
import { UpdateFoodsDto } from '@foods/application/dtos/update-foods.dto';
import { Foods } from '../entities/foods.entity';

export const FOODS_REPOSITORY = Symbol('FoodsRepository');

export interface FoodsRepository {
  findAll(
    page?: number,
    limit?: number,
  ): Promise<{ data: Foods[]; total: number; page: number; limit: number }>;
  findById(id: string): Promise<Foods | null>;
  save(foods: CreateFoodsDto): Promise<Foods>;
  updateById(id: string, dto: UpdateFoodsDto): Promise<Foods>;
}

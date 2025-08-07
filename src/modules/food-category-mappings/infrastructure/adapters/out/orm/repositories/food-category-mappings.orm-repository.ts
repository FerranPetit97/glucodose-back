import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { FoodsOrmEntity } from '@foods/infrastructure/adapters/out/orm/entities/foods.orm-entity';
import { FoodCategoryMappings } from '@foodCategoryMappings/domain/entities/food-category-mappings.entity';
import { FoodCategoryMappingsRepository } from '@foodCategoryMappings/domain/repositories/food-category-mappings.repository';
import { FoodCategoriesOrmEntity } from '@foodCategories/infrastructure/adapters/out/orm/entities/food-categories.orm-entity';
import { FoodCategoryMappingsOrmEntity } from '../entities/food-category-mappings.orm-entity';

@Injectable()
export class FoodCategoryMappingsOrmRepository
  implements FoodCategoryMappingsRepository {
  constructor(private readonly em: EntityManager) { }

  async save(item: FoodCategoryMappings): Promise<void> {
    try {
      let ormEntity: FoodCategoryMappingsOrmEntity;

      const existing = await this.em.findOne(FoodCategoryMappingsOrmEntity, {
        food: item.food_id,
        category: item.category_id,
      });

      if (existing) {
        ormEntity = existing;
      } else {
        ormEntity = new FoodCategoryMappingsOrmEntity();
        ormEntity.food = this.em.getReference(FoodsOrmEntity, item.food_id);
        ormEntity.category = this.em.getReference(
          FoodCategoriesOrmEntity,
          item.category_id,
        );
        this.em.persist(ormEntity);
      }

      await this.em.flush();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error guardando food-category mapping:', error.message);
        throw error;
      }
      console.error(
        'Error desconocido al guardar food-category mapping:',
        error,
      );
      throw new Error('Error desconocido al guardar food-category mapping');
    }
  }

  async findByFoodId(foodId: string): Promise<FoodCategoryMappings[]> {
    const mappings = await this.em.find(
      FoodCategoryMappingsOrmEntity,
      { food: foodId },
      { populate: ['category'] }
    );
    return mappings.map((mapping) => {
      if (!mapping.food?.id || !mapping.category?.id) {
        throw new Error('Food or Category id is missing in mapping');
      }
      return new FoodCategoryMappings(
        mapping.food.id,
        mapping.category.id,
      );
    });
  }

  async deleteByFoodId(food_id: string): Promise<void> {
    await this.em.nativeDelete(FoodCategoryMappingsOrmEntity, { food: food_id });
  }

  async delete(food_id: string, category_id: string): Promise<void> {
    await this.em.nativeDelete(FoodCategoryMappingsOrmEntity, {
      food: food_id,
      category: category_id,
    });
  }
}

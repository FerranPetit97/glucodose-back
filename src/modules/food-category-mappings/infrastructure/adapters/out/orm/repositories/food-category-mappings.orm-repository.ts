import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { FoodCategoryMappings } from '../../../../../domain/entities/food-category-mappings.entity';
import { FoodCategoryMappingsRepository } from '../../../../../domain/repositories/food-category-mappings.repository';
import { FoodCategoryMappingsOrmEntity } from '../entities/food-category-mappings.orm-entity';
import { FoodsOrmEntity } from 'src/modules/foods/infrastructure/adapters/out/orm/entities/foods.orm-entity';
import { FoodCategoriesOrmEntity } from 'src/modules/food-categories/infrastructure/adapters/out/orm/entities/food-categories.orm-entity';

@Injectable()
export class FoodCategoryMappingsOrmRepository
  implements FoodCategoryMappingsRepository
{
  constructor(private readonly em: EntityManager) {}

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
}

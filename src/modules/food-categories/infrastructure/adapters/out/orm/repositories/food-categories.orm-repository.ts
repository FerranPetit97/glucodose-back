import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { FoodCategories } from '../../../../../domain/entities/food-categories.entity';
import { FoodCategoriesRepository } from '../../../../../domain/repositories/food-categories.repository';
import { FoodCategoriesOrmEntity } from '../entities/food-categories.orm-entity';

@Injectable()
export class FoodCategoriesOrmRepository implements FoodCategoriesRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<FoodCategories[]> {
    const ormEntities = await this.em.find(FoodCategoriesOrmEntity, {});
    return ormEntities.map((e) => e.toDomain());
  }

  async findById(id: string): Promise<FoodCategories | null> {
    const ormEntity = await this.em.findOne(FoodCategoriesOrmEntity, { id });
    return ormEntity ? ormEntity.toDomain() : null;
  }

  async save(foodCategories: FoodCategories): Promise<FoodCategories> {
    try {
      let ormEntity: FoodCategoriesOrmEntity;

      if (foodCategories.id) {
        const existing = await this.em.findOne(FoodCategoriesOrmEntity, {
          id: foodCategories.id,
        });

        if (!existing) {
          throw new Error(`${foodCategories.id} not found`);
        }

        this.em.assign(existing, {
          name: foodCategories.name,
          description: foodCategories.description,
        });

        ormEntity = existing;
      } else {
        ormEntity = FoodCategoriesOrmEntity.fromDomain(foodCategories);
        this.em.persist(ormEntity);
      }

      await this.em.flush();
      return ormEntity.toDomain();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error guardando food:', error.message);
        throw error;
      }
      console.error('Error desconocido al guardar food:', error);
      throw new Error('Error desconocido al guardar food');
    }
  }
}

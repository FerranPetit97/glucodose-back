import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';
import { FoodCategoriesRepository } from '@foodCategories/domain/repositories/food-categories.repository';
import { FoodCategoriesOrmEntity } from '../entities/food-categories.orm-entity';

@Injectable()
export class FoodCategoriesOrmRepository implements FoodCategoriesRepository {
  constructor(private readonly em: EntityManager) { }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: FoodCategories[]; total: number; page: number; limit: number }> {

    const [foodCategoriesOrm, total] = await this.em.findAndCount(
      FoodCategoriesOrmEntity,
      {},
      {
        limit,
        offset: (page - 1) * limit,
      },
    );

    return {
      data: foodCategoriesOrm.map((foodCategoriesOrm) => {
        return FoodCategories.fromPersistence(
          foodCategoriesOrm.id,
          foodCategoriesOrm.name,
          foodCategoriesOrm.description,
        );
      }),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<FoodCategories | null> {
    const foodCategoriesOrm = await this.em.findOne(FoodCategoriesOrmEntity, id
    );
    if (!foodCategoriesOrm) return null;

    return FoodCategories.fromPersistence(
      foodCategoriesOrm.id,
      foodCategoriesOrm.name,
      foodCategoriesOrm.description,
    );
  }

  async findByName(name: string): Promise<FoodCategories | null> {
    const foodCategoriesOrm = await this.em.findOne(FoodCategoriesOrmEntity, {
      name: name.trim(),
    });
    
    if (!foodCategoriesOrm) return null;

    return FoodCategories.fromPersistence(
      foodCategoriesOrm.id,
      foodCategoriesOrm.name,
      foodCategoriesOrm.description,
    );
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

import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Foods } from '../../../../../domain/entities/foods.entity';
import { FoodsRepository } from '../../../../../domain/repositories/foods.repository';
import { FoodsOrmEntity } from '../entities/foods.orm-entity';

@Injectable()
export class FoodsOrmRepository implements FoodsRepository {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Foods[]> {
    const foodsOrm = await this.em.find(
      FoodsOrmEntity,
      {},
      {
        populate: ['categoryMappings', 'categoryMappings.category'],
      },
    );

    return foodsOrm.map((foodOrm) => foodOrm.toDomain());
  }

  async findById(id: string): Promise<Foods | null> {
    const foodOrm = await this.em.findOne(FoodsOrmEntity, id, {
      populate: ['categoryMappings', 'categoryMappings.category'],
    });
    if (!foodOrm) return null;
    return foodOrm.toDomain();
  }

  async save(food: Foods): Promise<Foods> {
    try {
      let ormEntity: FoodsOrmEntity;

      if (food.id) {
        const existing = await this.em.findOne(FoodsOrmEntity, { id: food.id });

        if (!existing) {
          throw new Error(`No se encontró Food con id ${food.id}`);
        }

        this.em.assign(existing, {
          name: food.name,
          carbs: Number(food.carbs),
          proteins: Number(food.proteins),
          fats: Number(food.fats),
          calories: Number(food.calories),
        });

        ormEntity = existing;
      } else {
        ormEntity = FoodsOrmEntity.fromDomain(food);
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

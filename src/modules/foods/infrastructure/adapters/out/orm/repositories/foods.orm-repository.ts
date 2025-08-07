import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Foods } from '@app/modules/foods/domain/entities/foods.entity';
import { FoodsRepository } from '@foods/domain/repositories/foods.repository';
import { CreateFoodsDto } from '@foods/application/dtos/create-foods.dto';
import { FoodsOrmEntity } from '../entities/foods.orm-entity';

@Injectable()
export class FoodsOrmRepository implements FoodsRepository {
  constructor(private readonly em: EntityManager) { }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ data: Foods[]; total: number; page: number; limit: number }> {
    const [foodsOrm, total] = await this.em.findAndCount(
      FoodsOrmEntity,
      {},
      {
        populate: ['categoryMappings', 'categoryMappings.category'],
        limit,
        offset: (page - 1) * limit,
      },
    );

    return {
      data: foodsOrm.map((foodOrm) => {
        const categoryIds = foodOrm.categoryMappings
          .getItems()
          .map((mapping) => mapping.category?.id)
          .filter((id): id is string => typeof id === 'string');

        return Foods.fromPersistence(
          foodOrm.id,
          foodOrm.name,
          foodOrm.carbs,
          foodOrm.proteins,
          foodOrm.fats,
          foodOrm.calories,
          categoryIds
        );
      }),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Foods | null> {
    const foodOrm = await this.em.findOne(FoodsOrmEntity, id, {
      populate: ['categoryMappings', 'categoryMappings.category'],
    });
    if (!foodOrm) return null;

    const categoryIds = foodOrm.categoryMappings
      .getItems()
      .map((mapping) => mapping.category?.id)
      .filter((id): id is string => typeof id === 'string');

    return Foods.fromPersistence(
      foodOrm.id,
      foodOrm.name,
      foodOrm.carbs,
      foodOrm.proteins,
      foodOrm.fats,
      foodOrm.calories,
      categoryIds
    );
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

  async updateById(id: string, dto: CreateFoodsDto): Promise<Foods> {
    return this.em.transactional(async (transactionalEntityManager) => {
      const existing = await transactionalEntityManager.findOne(
        FoodsOrmEntity,
        id,
      );

      if (!existing) {
        throw new NotFoundException(`Food with id ${id} not found`);
      }

      transactionalEntityManager.assign(existing, {
        name: dto.name ?? existing.name,
        carbs: dto.carbs !== undefined ? Number(dto.carbs) : Number(existing.carbs),
        proteins: dto.proteins !== undefined ? Number(dto.proteins) : Number(existing.proteins),
        fats: dto.fats !== undefined ? Number(dto.fats) : Number(existing.fats),
        calories: dto.calories !== undefined ? Number(dto.calories) : Number(existing.calories),
      });

      await transactionalEntityManager.flush();

      return existing.toDomain();
    });
  }
}

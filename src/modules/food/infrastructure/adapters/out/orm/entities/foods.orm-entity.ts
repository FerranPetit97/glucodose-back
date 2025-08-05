// src/modules/food/infrastructure/adapters/out/orm/entities/foods.orm-entity.ts

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Foods } from '../../../../../domain/entities/foods.entity';
import { CreateFoodDto } from 'src/modules/food/application/dtos/create-food.dto';

@Entity({ tableName: 'foods', schema: 'core_data_foods' })
export class FoodsOrmEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id?: string;

  @Property()
  name!: string;

  @Property()
  carbs!: number;

  @Property()
  proteins!: number;

  @Property()
  fats!: number;

  @Property()
  calories!: number;

  toDomain(): Foods {
    return Foods.restore(
      this.id,
      this.name,
      this.carbs,
      this.proteins,
      this.fats,
      this.calories,
    );
  }

  static fromDomain(domain: CreateFoodDto): FoodsOrmEntity {
    const orm = new FoodsOrmEntity();
    orm.name = domain.name;
    orm.carbs = domain.carbs;
    orm.proteins = domain.proteins;
    orm.fats = domain.fats;
    orm.calories = domain.calories;
    return orm;
  }
}

import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Foods } from '../../../../../domain/entities/foods.entity';
import { CreateFoodsDto } from 'src/modules/foods/application/dtos/create-foods.dto';
import { FoodCategoryMappingsOrmEntity } from 'src/modules/food-category-mappings/infrastructure/adapters/out/orm/entities/food-category-mappings.orm-entity';

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

  @OneToMany(() => FoodCategoryMappingsOrmEntity, (mapping) => mapping.food)
  categoryMappings = new Collection<FoodCategoryMappingsOrmEntity>(this);

  toDomain(): Foods {
    const foodDomain = new Foods(
      this.id,
      this.name,
      this.carbs,
      this.proteins,
      this.fats,
      this.calories,
    );

    const categoryNames = this.categoryMappings
      .getItems()
      .map((mapping) => mapping.category.name);

    foodDomain.setCategories(categoryNames);

    return foodDomain;
  }

  static fromDomain(domain: CreateFoodsDto): FoodsOrmEntity {
    const orm = new FoodsOrmEntity();
    orm.name = domain.name;
    orm.carbs = domain.carbs;
    orm.proteins = domain.proteins;
    orm.fats = domain.fats;
    orm.calories = domain.calories;
    return orm;
  }
}

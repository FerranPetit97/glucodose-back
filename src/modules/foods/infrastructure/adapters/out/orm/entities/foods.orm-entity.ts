import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Foods } from '@foods/domain/entities/foods.entity';
import { FoodCategoryMappingsOrmEntity } from '@foodCategoryMappings/infrastructure/adapters/out/orm/entities/food-category-mappings.orm-entity';

@Entity({ tableName: 'foods', schema: 'core_data_foods' })
export class FoodsOrmEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

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
      Number(this.carbs),
      Number(this.proteins),
      Number(this.fats),
      Number(this.calories),
    );

    const categoryIds = this.categoryMappings
      .getItems()
      .map((mapping) => mapping.category?.id)
      .filter((id): id is string => typeof id === 'string');

    foodDomain.setCategories(categoryIds);

    return foodDomain;
  }

  static fromDomain(domain: Foods): FoodsOrmEntity {
    const orm = new FoodsOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.name = domain.name;
    orm.carbs = Number(domain.carbs);
    orm.proteins = Number(domain.proteins);
    orm.fats = Number(domain.fats);
    orm.calories = Number(domain.calories);
    return orm;
  }
}

import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';
import { FoodCategoryMappingsOrmEntity } from '@foodCategoryMappings/infrastructure/adapters/out/orm/entities/food-category-mappings.orm-entity';

@Entity({ tableName: 'food_categories', schema: 'core_data_foods' })
export class FoodCategoriesOrmEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property()
  name!: string;

  @Property()
  description!: string;

  @OneToMany(() => FoodCategoryMappingsOrmEntity, (mapping) => mapping.category)
  foodMappings = new Collection<FoodCategoryMappingsOrmEntity>(this);

  toDomain(): FoodCategories {
    return FoodCategories.fromPersistence(this.id, this.name, this.description);
  }

  static fromDomain(domain: FoodCategories): FoodCategoriesOrmEntity {
    const orm = new FoodCategoriesOrmEntity();
    orm.name = domain.name;
    orm.description = domain.description;
    return orm;
  }
}

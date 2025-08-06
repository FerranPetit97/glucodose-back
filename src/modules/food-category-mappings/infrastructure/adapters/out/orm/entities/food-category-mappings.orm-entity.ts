import { Entity, ManyToOne, Unique } from '@mikro-orm/core';
import { FoodCategoriesOrmEntity } from 'src/modules/food-categories/infrastructure/adapters/out/orm/entities/food-categories.orm-entity';
import { FoodCategoryMappings } from 'src/modules/food-category-mappings/domain/entities/food-category-mappings.entity';
import { FoodsOrmEntity } from 'src/modules/foods/infrastructure/adapters/out/orm/entities/foods.orm-entity';
import { EntityManager } from '@mikro-orm/postgresql';

@Entity({ tableName: 'food_category_mappings', schema: 'core_data_foods' })
@Unique({ properties: ['food', 'category'] })
export class FoodCategoryMappingsOrmEntity {
  @ManyToOne(() => FoodsOrmEntity, { primary: true })
  food!: FoodsOrmEntity;

  @ManyToOne(() => FoodCategoriesOrmEntity, { primary: true })
  category!: FoodCategoriesOrmEntity;

  static fromDomain(
    domain: FoodCategoryMappings,
    em: EntityManager,
  ): FoodCategoryMappingsOrmEntity {
    const entity = new FoodCategoryMappingsOrmEntity();

    entity.food = em.getReference(FoodsOrmEntity, domain.food_id);
    entity.category = em.getReference(
      FoodCategoriesOrmEntity,
      domain.category_id,
    );

    return entity;
  }

  toDomain(): FoodCategoryMappings {
    return new FoodCategoryMappings(this.food.id!, this.category.id!);
  }
}

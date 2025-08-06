import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FoodCategoryMappingsOrmEntity } from './infrastructure/adapters/out/orm/entities/food-category-mappings.orm-entity';
import { FoodCategoryMappingsOrmRepository } from './infrastructure/adapters/out/orm/repositories/food-category-mappings.orm-repository';
import { FOOD_CATEGORY_MAPPINGS_REPOSITORY } from './domain/repositories/food-category-mappings.repository';

@Module({
  imports: [MikroOrmModule.forFeature([FoodCategoryMappingsOrmEntity])],
  providers: [
    {
      provide: FOOD_CATEGORY_MAPPINGS_REPOSITORY,
      useClass: FoodCategoryMappingsOrmRepository,
    },
  ],
  exports: [
    {
      provide: FOOD_CATEGORY_MAPPINGS_REPOSITORY,
      useClass: FoodCategoryMappingsOrmRepository,
    },
  ],
})
export class FoodCategoryMappingsModule {}

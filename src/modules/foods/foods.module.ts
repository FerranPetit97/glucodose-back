import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { FoodsOrmEntity } from './infrastructure/adapters/out/orm/entities/foods.orm-entity';
import { FoodsOrmRepository } from './infrastructure/adapters/out/orm/repositories/foods.orm-repository';
import { FoodsController } from './infrastructure/adapters/in/controllers/foods.controller';
import { GetAllFoodsUseCase } from './application/use-cases/get-all-foods.use-case';
import { GetFoodsByIdUseCase } from './application/use-cases/get-foods-by-id.use-case';
import { CreateFoodsUseCase } from './application/use-cases/create-foods.use-case';
import { UpdateFoodsUseCase } from './application/use-cases/update-foods.use-case';

import { FOODS_REPOSITORY } from './domain/repositories/foods.repository';
import { FoodCategoryMappingsModule } from '../food-category-mappings/food-categories-mappings.module';

import { FoodCategoriesModule } from '../food-categories/food-categories.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([FoodsOrmEntity]),
    FoodCategoriesModule,
    FoodCategoryMappingsModule,
  ],
  providers: [
    { provide: FOODS_REPOSITORY, useClass: FoodsOrmRepository },
    GetAllFoodsUseCase,
    GetFoodsByIdUseCase,
    CreateFoodsUseCase,
    UpdateFoodsUseCase,
  ],
  controllers: [FoodsController],
  exports: [
    { provide: FOODS_REPOSITORY, useClass: FoodsOrmRepository },
    GetAllFoodsUseCase,
    GetFoodsByIdUseCase,
    CreateFoodsUseCase,
    UpdateFoodsUseCase,
  ],
})
export class FoodsModule {}

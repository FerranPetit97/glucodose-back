import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { FoodCategoriesOrmEntity } from './infrastructure/adapters/out/orm/entities/food-categories.orm-entity';
import { FoodCategoriesOrmRepository } from './infrastructure/adapters/out/orm/repositories/food-categories.orm-repository';
import { FoodCategoriesController } from './infrastructure/adapters/in/controllers/food-categories.controller';

import { GetAllFoodCategoriesUseCase } from './application/use-cases/get-all-food-categories.use-case';
import { GetFoodCategoriesByIdUseCase } from './application/use-cases/get-food-categories-by-id.use-case';
import { CreateFoodCategoriesUseCase } from './application/use-cases/create-food-categories.use-case';
import { UpdateFoodCategoriesUseCase } from './application/use-cases/update-food-categories.use-case';
import { FoodCategoryValidationService } from './application/services/food-category-validation.service';

import { FOOD_CATEGORIES_REPOSITORY } from './domain/repositories/food-categories.repository';

@Module({
  imports: [MikroOrmModule.forFeature([FoodCategoriesOrmEntity])],
  providers: [
    {
      provide: FOOD_CATEGORIES_REPOSITORY,
      useClass: FoodCategoriesOrmRepository,
    },
    FoodCategoryValidationService,
    GetAllFoodCategoriesUseCase,
    GetFoodCategoriesByIdUseCase,
    CreateFoodCategoriesUseCase,
    UpdateFoodCategoriesUseCase,
  ],
  controllers: [FoodCategoriesController],
  exports: [
    {
      provide: FOOD_CATEGORIES_REPOSITORY,
      useClass: FoodCategoriesOrmRepository,
    },
    GetAllFoodCategoriesUseCase,
    GetFoodCategoriesByIdUseCase,
    CreateFoodCategoriesUseCase,
    UpdateFoodCategoriesUseCase,
  ],
})
export class FoodCategoriesModule {}

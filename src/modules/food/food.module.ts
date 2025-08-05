import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { FoodsOrmEntity } from './infrastructure/adapters/out/orm/entities/foods.orm-entity';
import { FoodsOrmRepository } from './infrastructure/adapters/out/orm/repositories/foods.orm-repository';
import { FoodsController } from './infrastructure/adapters/in/controllers/foods.controller';
import { GetAllFoodsUseCase } from './application/use-cases/get-all-foods.use-case';
import { GetFoodByIdUseCase } from './application/use-cases/get-food-by-id.use-case';
import { CreateFoodUseCase } from './application/use-cases/create-foods.use-case';

import { FOODS_REPOSITORY } from './domain/repositories/foods.repository';
import { UpdateFoodUseCase } from './application/use-cases/update-foods.use-case';

@Module({
  imports: [MikroOrmModule.forFeature([FoodsOrmEntity])],
  providers: [
    { provide: FOODS_REPOSITORY, useClass: FoodsOrmRepository },
    GetAllFoodsUseCase,
    GetFoodByIdUseCase,
    CreateFoodUseCase,
    UpdateFoodUseCase,
  ],
  controllers: [FoodsController],
  exports: [
    { provide: FOODS_REPOSITORY, useClass: FoodsOrmRepository },
    GetAllFoodsUseCase,
    GetFoodByIdUseCase,
    CreateFoodUseCase,
    UpdateFoodUseCase,
  ],
})
export class FoodModule {}

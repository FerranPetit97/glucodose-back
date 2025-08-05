import { Inject, Injectable } from '@nestjs/common';
import {
  FOODS_REPOSITORY,
  FoodsRepository,
} from '../../domain/repositories/foods.repository';
import { CreateFoodDto } from '../dtos/create-food.dto';
import { Foods } from '../../domain/entities/foods.entity';

@Injectable()
export class CreateFoodUseCase {
  constructor(
    @Inject(FOODS_REPOSITORY)
    private readonly foodsRepository: FoodsRepository,
  ) {}

  async execute(dto: CreateFoodDto): Promise<Foods> {
    const food = Foods.create(
      dto.name,
      dto.carbs,
      dto.proteins,
      dto.fats,
      dto.calories,
    );
    return await this.foodsRepository.save(food);
  }
}

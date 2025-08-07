import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FOODS_REPOSITORY,
  FoodsRepository,
} from '@foods/domain/repositories/foods.repository';
import { Foods } from '@app/modules/foods/domain/entities/foods.entity';

@Injectable()
export class GetFoodsByIdUseCase {
  constructor(
    @Inject(FOODS_REPOSITORY)
    private readonly foodsRepository: FoodsRepository,
  ) { }

  async execute(id: string): Promise<Foods> {
    const foods = await this.foodsRepository.findById(id);
    if (!foods) throw new NotFoundException(`Foods with ID ${id} not found`);
    return foods;
  }
}

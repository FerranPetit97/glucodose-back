import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Foods } from '../../domain/entities/foods.entity';
import { FOODS_REPOSITORY, FoodsRepository } from '../../domain/repositories/foods.repository';

@Injectable()
export class GetFoodsByIdUseCase {
  constructor(
    @Inject(FOODS_REPOSITORY)
    private readonly foodsRepository: FoodsRepository,
  ) {}

  async execute(id: string): Promise<Foods> {
    const foods = await this.foodsRepository.findById(id);
    if (!foods) throw new NotFoundException(`Foods with ID ${id} not found`);
    return foods;
  }
}

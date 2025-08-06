import { Inject, Injectable } from '@nestjs/common';
import { Foods } from '../../domain/entities/foods.entity';
import { FOODS_REPOSITORY, FoodsRepository } from '../../domain/repositories/foods.repository';

@Injectable()
export class GetAllFoodsUseCase {
  constructor(
    @Inject(FOODS_REPOSITORY)
    private readonly foodsRepository: FoodsRepository,
  ) {}

  async execute(): Promise<Foods[] | []> {
    return this.foodsRepository.findAll();
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Foods } from '@foods/domain/entities/foods.entity';
import {
  FOODS_REPOSITORY,
  FoodsRepository,
} from '@foods/domain/repositories/foods.repository';

@Injectable()
export class GetAllFoodsUseCase {
  constructor(
    @Inject(FOODS_REPOSITORY)
    private readonly foodsRepository: FoodsRepository,
  ) { }

  async execute(
    page = 1,
    limit = 10,
  ): Promise<{ data: Foods[]; total: number; page: number; limit: number }> {
    return this.foodsRepository.findAll(page, limit);
  }
}

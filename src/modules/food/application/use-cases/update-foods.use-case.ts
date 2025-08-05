// src/modules/food/application/use-cases/update-food.use-case.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FOODS_REPOSITORY,
  FoodsRepository,
} from '../../domain/repositories/foods.repository';
import { UpdateFoodDto } from '../dtos/update-food.dto';
import { Foods } from '../../domain/entities/foods.entity';

@Injectable()
export class UpdateFoodUseCase {
  constructor(
    @Inject(FOODS_REPOSITORY)
    private readonly foodsRepository: FoodsRepository,
  ) {}

  async execute(id: string, dto: UpdateFoodDto): Promise<Foods> {
    const existing = await this.foodsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Food with id ${id} not found`);
    }

    const updated = Foods.restore(
      id,
      dto.name ?? existing.name,
      dto.carbs ?? existing.carbs,
      dto.proteins ?? existing.proteins,
      dto.fats ?? existing.fats,
      dto.calories ?? existing.calories,
    );

    await this.foodsRepository.save(updated);
    return updated;
  }
}

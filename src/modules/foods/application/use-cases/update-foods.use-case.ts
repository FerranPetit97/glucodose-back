import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FOODS_REPOSITORY,
  FoodsRepository,
} from '../../domain/repositories/foods.repository';
import { UpdateFoodsDto } from '../dtos/update-foods.dto';
import { Foods } from '../../domain/entities/foods.entity';

@Injectable()
export class UpdateFoodsUseCase {
  constructor(
    @Inject(FOODS_REPOSITORY)
    private readonly foodsRepository: FoodsRepository,
  ) {}

  async execute(id: string, dto: UpdateFoodsDto): Promise<Foods> {
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

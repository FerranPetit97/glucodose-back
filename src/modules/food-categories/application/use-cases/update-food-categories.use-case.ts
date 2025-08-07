import { Inject, Injectable } from '@nestjs/common';
import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '@foodCategories/domain/repositories/food-categories.repository';
import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';
import { UpdateFoodCategoriesDto } from '../dtos/update-food-categories.dto';
import { FoodCategoryNotFoundError } from '../../../../common/errors/domain-error';
import { FoodCategoryValidationService } from '../services/food-category-validation.service';

@Injectable()
export class UpdateFoodCategoriesUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
    private readonly validationService: FoodCategoryValidationService,
  ) { }

  async execute(
    id: string,
    dto: UpdateFoodCategoriesDto,
  ): Promise<FoodCategories> {
    this.validationService.validateUpdateData({
      name: dto.name,
      description: dto.description,
    });

    const existing = await this.foodCategoriesRepository.findById(id);
    if (!existing) {
      throw new FoodCategoryNotFoundError(id);
    }

    const updated = existing.updateDetails(
      dto.name ?? existing.name,
      dto.description ?? existing.description,
    );

    await this.foodCategoriesRepository.save(updated);
    return updated;
  }
}

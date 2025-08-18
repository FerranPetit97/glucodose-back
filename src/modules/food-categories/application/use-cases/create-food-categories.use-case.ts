import { Inject, Injectable } from '@nestjs/common';

import {
  FOOD_CATEGORIES_REPOSITORY,
  FoodCategoriesRepository,
} from '@foodCategories/domain/repositories/food-categories.repository';
import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';
import { FoodCategoryAlreadyExistsError } from '../../../../common/errors/domain-error';
import { FoodCategoryValidationService } from '../services/food-category-validation.service';

import { CreateFoodCategoriesDto } from '../dtos/create-food-categories.dto';

@Injectable()
export class CreateFoodCategoriesUseCase {
  constructor(
    @Inject(FOOD_CATEGORIES_REPOSITORY)
    private readonly foodCategoriesRepository: FoodCategoriesRepository,
    private readonly validationService: FoodCategoryValidationService,
  ) { }

  async execute(dto: CreateFoodCategoriesDto): Promise<FoodCategories> {
    // ✅ APPLICATION LAYER: Validate input data
    this.validationService.validateCreateData({
      name: dto.name,
      description: dto.description,
    });

    // ✅ APPLICATION LAYER: Check business rules
    const existingCategory = await this.foodCategoriesRepository.findByName(dto.name);
    if (existingCategory) {
      throw new FoodCategoryAlreadyExistsError(dto.name);
    }

    // ✅ DOMAIN LAYER: Create entity with validated data
    const category = FoodCategories.create(dto.name, dto.description);
    
    // ✅ INFRASTRUCTURE LAYER: Persist entity
    return await this.foodCategoriesRepository.save(category);
  }
}

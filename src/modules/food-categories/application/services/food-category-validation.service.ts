// Example of a service that validates food category data before creating or updating entities
// This service is used in the application layer to ensure data integrity and business rules are followed
// It does not contain any database logic or direct entity manipulation
import { Injectable } from '@nestjs/common';
import { FoodCategoryValidationError } from '../../../../common/errors/domain-error';

export interface CreateFoodCategoryData {
  name: string;
  description: string;
}

export interface UpdateFoodCategoryData {
  name?: string;
  description?: string;
}

@Injectable()
export class FoodCategoryValidationService {
  
  validateCreateData(data: CreateFoodCategoryData): void {
    this.validateName(data.name);
    this.validateDescription(data.description);
  }

  validateUpdateData(data: UpdateFoodCategoryData): void {
    if (data.name !== undefined) {
      this.validateName(data.name);
    }
    if (data.description !== undefined) {
      this.validateDescription(data.description);
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new FoodCategoryValidationError('Name is required');
    }
    if (name.trim().length < 2) {
      throw new FoodCategoryValidationError('Name must be at least 2 characters long');
    }
    if (name.trim().length > 100) {
      throw new FoodCategoryValidationError('Name must not exceed 100 characters');
    }
  }

  private validateDescription(description: string): void {
    if (description && description.length > 500) {
      throw new FoodCategoryValidationError('Description must not exceed 500 characters');
    }
  }
}

import { FoodCategories } from '../../domain/entities/food-categories.entity';

export class ResponseFoodCategoriesDto {
  id!: string;
  name!: string;
  description!: string;

  static fromDomain(foodCategories: FoodCategories): ResponseFoodCategoriesDto {
    if (!foodCategories.id) {
      throw new Error(
        'Cannot create response DTO from a domain entity without ID',
      );
    }

    const dto = new ResponseFoodCategoriesDto();
    dto.id = foodCategories.id;
    dto.name = foodCategories.name;
    dto.description = foodCategories.description;
    return dto;
  }
}

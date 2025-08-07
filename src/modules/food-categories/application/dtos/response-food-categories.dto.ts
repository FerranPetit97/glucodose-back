import { FoodCategories } from '@foodCategories/domain/entities/food-categories.entity';

export class ResponseFoodCategoriesDto {
  id!: string;
  name!: string;
  description!: string;

  constructor(
    id: string,
    name: string,
    description: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  static fromDomain(foodCategories: FoodCategories): ResponseFoodCategoriesDto {
    if (!foodCategories.id) {
      throw new Error(
        'Cannot create response DTO from a domain entity without ID',
      );
    }

    return new ResponseFoodCategoriesDto(foodCategories.id, foodCategories.name, foodCategories.description);
  }

}

import { Foods } from '../../domain/entities/foods.entity';

export class CreatedFoodsDto {
  id!: string;
  name!: string;
  carbs!: number;
  proteins!: number;
  fats!: number;
  calories!: number;
  categories?: string[];

  static fromDomain(food: Foods): CreatedFoodsDto {
    if (!food.id) {
      throw new Error(
        'Cannot create response DTO from a domain entity without ID',
      );
    }

    const dto = new CreatedFoodsDto();
    dto.id = food.id;
    dto.name = food.name;
    dto.carbs = food.carbs;
    dto.proteins = food.proteins;
    dto.fats = food.fats;
    dto.calories = food.calories;
    dto.categories = food.getCategories();
    return dto;
  }
}

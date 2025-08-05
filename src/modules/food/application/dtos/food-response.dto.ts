import { Foods } from '../../domain/entities/foods.entity';

export class FoodResponseDto {
  id!: string;
  name!: string;
  carbs!: number;
  proteins!: number;
  fats!: number;
  calories!: number;

  static fromDomain(food: Foods): FoodResponseDto {
    if (!food.id) {
      throw new Error(
        'Cannot create response DTO from a domain entity without ID',
      );
    }

    const dto = new FoodResponseDto();
    dto.id = food.id;
    dto.name = food.name;
    dto.carbs = food.carbs;
    dto.proteins = food.proteins;
    dto.fats = food.fats;
    dto.calories = food.calories;
    return dto;
  }
}

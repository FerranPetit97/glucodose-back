import { Foods } from '@app/modules/foods/domain/entities/foods.entity';

export class FoodsResponseDto {
  id: string;
  name: string;
  carbs: number;
  proteins: number;
  fats: number;
  calories: number;
  categories: string[];

  constructor(
    id: string,
    name: string,
    carbs: number,
    proteins: number,
    fats: number,
    calories: number,
    categories: string[] = [],
  ) {
    this.id = id;
    this.name = name;
    this.carbs = carbs;
    this.proteins = proteins;
    this.fats = fats;
    this.calories = calories;
    this.categories = categories;
  }

  static fromDomain(food: Foods): FoodsResponseDto {
    if (!food.id) {
      throw new Error(
        'Cannot create response DTO from a domain entity without ID',
      );
    }
    return new FoodsResponseDto(
      food.id,
      food.name,
      Number(food.carbs),
      Number(food.proteins),
      Number(food.fats),
      Number(food.calories),
      food.getCategories() ?? [],
    );
  }
}

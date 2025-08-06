export class FoodCategoryMappings {
  constructor(
    public readonly food_id: string,
    public readonly category_id: string,
  ) {}

  static create(food_id: string, category_id: string): FoodCategoryMappings {
    return new FoodCategoryMappings(food_id, category_id);
  }
}

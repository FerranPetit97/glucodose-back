export class FoodCategories {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly description: string,
  ) {}

  static create(name: string, description: string): FoodCategories {
    return new FoodCategories(undefined, name, description);
  }

  static restore(
    id: string | undefined,
    name: string,
    description: string,
  ): FoodCategories {
    return new FoodCategories(id, name, description);
  }
}

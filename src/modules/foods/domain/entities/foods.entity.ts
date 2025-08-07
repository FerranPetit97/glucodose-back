export class Foods {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly carbs: number,
    public readonly proteins: number,
    public readonly fats: number,
    public readonly calories: number,
    private categories: string[] = [],
  ) { }

  static create(
    name: string,
    carbs: number | string,
    proteins: number | string,
    fats: number | string,
    calories: number | string,
  ): Foods {
    return new Foods(
      undefined,
      name,
      Number(carbs),
      Number(proteins),
      Number(fats),
      Number(calories)
    );
  }

  static fromPersistence(
    id: string,
    name: string,
    carbs: number | string,
    proteins: number | string,
    fats: number | string,
    calories: number | string,
    categories: string[] = [],
  ): Foods {
    return new Foods(
      id,
      name,
      Number(carbs),
      Number(proteins),
      Number(fats),
      Number(calories),
      categories
    );
  }

  setCategories(categories: string[] | undefined) {
    if (!categories || !Array.isArray(categories)) {
      throw new Error('Categories must be an array');
    }
    this.categories = categories;
  }

  getCategories(): string[] {
    return this.categories;
  }
}

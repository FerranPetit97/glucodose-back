export class Foods {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly carbs: number,
    public readonly proteins: number,
    public readonly fats: number,
    public readonly calories: number,
  ) {}

  static create(
    name: string,
    carbs: number,
    proteins: number,
    fats: number,
    calories: number,
  ): Foods {
    return new Foods(undefined, name, carbs, proteins, fats, calories);
  }

  static restore(
    id: string | undefined,
    name: string,
    carbs: number,
    proteins: number,
    fats: number,
    calories: number,
  ): Foods {
    return new Foods(id, name, carbs, proteins, fats, calories);
  }
}

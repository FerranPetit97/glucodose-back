export abstract class BaseEntity {
  id: string;
  created_at?: Date;
  updated_at?: Date;

  constructor(id: string, created_at?: Date, updated_at?: Date) {
    this.id = id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

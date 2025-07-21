import { BaseEntity } from '../../../common/abstract/base.entity';

export class Food extends BaseEntity {
  name: string;
  carbs: number;
  proteins: number;
  fats: number;
  calories: number;

  constructor(props: Partial<Food>) {
    super(props.id || '', props.created_at, props.updated_at);
    Object.assign(this, props);
  }
}

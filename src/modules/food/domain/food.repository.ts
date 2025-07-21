import { BaseRepository } from '../../../common/abstract/base.repository';
import { Food } from './food.entity';

export interface FoodRepository extends BaseRepository<Food> {
  // Métodos adicionales si necesitas búsquedas específicas
}

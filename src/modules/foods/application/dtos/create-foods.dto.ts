import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFoodsDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  carbs!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  proteins!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fats!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  calories!: number;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  categoriesIds?: string[];
}

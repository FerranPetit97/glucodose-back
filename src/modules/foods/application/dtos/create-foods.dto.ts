import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateFoodsDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  carbs!: number;

  @IsNumber()
  @Min(0)
  proteins!: number;

  @IsNumber()
  @Min(0)
  fats!: number;

  @IsNumber()
  @Min(0)
  calories!: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  categoriesIds?: string[];
}

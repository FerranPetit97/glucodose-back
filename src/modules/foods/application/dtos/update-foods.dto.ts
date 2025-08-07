import { IsOptional, IsString, IsNumber, Min, IsArray, ArrayUnique } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFoodsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  carbs?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  proteins?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fats?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  calories?: number;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  categoriesIds?: string[];
}

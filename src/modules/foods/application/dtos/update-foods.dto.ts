import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateFoodsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carbs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  proteins?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fats?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;
}

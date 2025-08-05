import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateFoodDto {
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
}

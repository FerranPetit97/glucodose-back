import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateFoodCategoriesDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description!: string;
}

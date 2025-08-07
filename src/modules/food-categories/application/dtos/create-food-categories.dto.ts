import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFoodCategoriesDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description!: string;
}

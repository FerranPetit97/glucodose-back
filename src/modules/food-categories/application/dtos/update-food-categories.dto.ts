import { IsOptional, IsString } from 'class-validator';

export class UpdateFoodCategoriesDto {
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

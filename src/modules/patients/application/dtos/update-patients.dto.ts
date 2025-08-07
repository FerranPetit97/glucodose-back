import { IsString, IsNumber, Min, IsNotEmpty, IsEmail, IsPhoneNumber, IsDateString } from 'class-validator';

export class UpdatePatientsDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsEmail()
  @Min(0)
  email?: string;

  @IsPhoneNumber()
  @Min(0)
  phone?: number;

  @IsDateString()
  @Min(0)
  dob?: string;

  @IsDateString()
  @Min(0)
  diagnosis_date?: number;

  @IsNumber()
  @Min(0)
  type_diabetes?: number;
}

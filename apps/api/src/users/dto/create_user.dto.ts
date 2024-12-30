import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserPatientDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  last_name: string;

  @IsOptional()
  @IsDateString()
  birthdate: Date;

  @IsNotEmpty()
  id_number: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  cellphone: number;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(31)
  password: string;

  @IsOptional()
  @IsString()
  residence_department: string;

  @IsOptional()
  @IsString()
  residence_city: string;

  @IsOptional()
  @IsString()
  residence_address: string;

  @IsOptional()
  @IsString()
  residence_neighborhood: string;
}

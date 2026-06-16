import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @IsEmail()
  @MaxLength(160)
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve ter 11 digitos ou formato 000.000.000-00.',
  })
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  rg!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{8}$|^\d{5}-\d{3}$/, {
    message: 'CEP deve ter 8 digitos ou formato 00000-000.',
  })
  cep!: string;

  @IsUUID()
  institutionId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  course!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  whatsappPhone?: string;
}

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';

export class CreatePartnerCompanyDto {
  @IsEmail()
  @MaxLength(160)
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ deve ter 14 digitos ou formato 00.000.000/0000-00.',
  })
  cnpj!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  tradeName!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  contactPhone?: string;
}

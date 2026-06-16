import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(160)
  displayName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Matches(
    /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    {
      message:
        'Documento deve ser CPF (11 digitos ou 000.000.000-00) ou CNPJ (14 digitos ou 00.000.000/0000-00).',
    },
  )
  document?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(30)
  rg?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Matches(/^\d{8}$|^\d{5}-\d{3}$/, {
    message: 'CEP deve ter 8 digitos ou formato 00000-000.',
  })
  cep?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(120)
  course?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(120)
  department?: string;

  @IsUUID()
  @IsOptional()
  institutionId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  contactPhone?: string;
}

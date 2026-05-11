import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateInstitutionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(160)
  name?: string;
}

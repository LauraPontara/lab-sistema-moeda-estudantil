import { IsEmail, IsOptional, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @MaxLength(160)
  @IsOptional()
  email?: string;
}

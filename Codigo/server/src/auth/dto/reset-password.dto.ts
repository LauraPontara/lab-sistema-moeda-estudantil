import { IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*])/, {
    message:
      'A senha deve conter pelo menos: uma letra maiúscula, uma minúscula, um número e um símbolo (!@#$%&*)',
  })
  newPassword!: string;
}

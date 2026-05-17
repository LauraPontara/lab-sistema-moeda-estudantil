import {
  IsInt,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SendCoinsDto {
  @IsUUID()
  studentId!: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  amount!: number;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  message!: string;
}

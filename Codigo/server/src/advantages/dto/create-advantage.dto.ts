import {
  IsIn,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ADVANTAGE_CATEGORIES } from '../../database/schemas';

export const ADVANTAGE_ICONS = [
  'utensils',
  'coffee',
  'graduation',
  'book',
  'notebook',
  'film',
  'ticket',
  'gift',
  'shopping',
  'tag',
  'pizza',
  'percent',
] as const;

export type AdvantageIcon = (typeof ADVANTAGE_ICONS)[number];

export class CreateAdvantageDto {
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  description!: string;

  @IsIn(ADVANTAGE_CATEGORIES)
  category!: (typeof ADVANTAGE_CATEGORIES)[number];

  @IsIn(ADVANTAGE_ICONS)
  icon!: AdvantageIcon;

  @IsInt()
  @Min(1)
  @Max(100000)
  costXp!: number;
}

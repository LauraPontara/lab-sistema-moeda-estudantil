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
import {
  ADVANTAGE_ICONS,
  AdvantageIcon,
} from '../constants/advantage-icons.constants';

export { ADVANTAGE_ICONS, AdvantageIcon };

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

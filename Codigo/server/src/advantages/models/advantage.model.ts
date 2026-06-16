import { AdvantageCategory } from '../../database/schemas';
import { AdvantageIcon } from '../dto/create-advantage.dto';

export interface AdvantageModel {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  category: AdvantageCategory;
  icon: AdvantageIcon;
  costXp: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

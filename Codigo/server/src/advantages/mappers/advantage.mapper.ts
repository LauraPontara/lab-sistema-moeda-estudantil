import { AdvantageCategory } from '../../database/schemas';
import { AdvantageIcon } from '../dto/create-advantage.dto';
import { AdvantageModel } from '../models/advantage.model';

export interface AdvantageRow {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  category: AdvantageCategory;
  icon: string;
  costXp: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AdvantageMapper {
  static toModel(row: AdvantageRow): AdvantageModel {
    return {
      id: row.id,
      companyId: row.companyId,
      companyName: row.companyName,
      title: row.title,
      description: row.description,
      category: row.category,
      icon: row.icon as AdvantageIcon,
      costXp: row.costXp,
      active: row.active,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

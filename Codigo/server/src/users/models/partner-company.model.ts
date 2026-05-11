import { BaseUserModel } from './user.model';

export interface PartnerCompanyModel extends BaseUserModel {
  cnpj: string;
  tradeName: string;
  address: string;
  contactPhone: string | null;
}

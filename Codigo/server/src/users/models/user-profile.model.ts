import { BaseUserModel } from './user.model';

export type DocumentType = 'CPF' | 'CNPJ';

export interface UserProfileModel extends BaseUserModel {
  displayName?: string;
  document?: string;
  documentType?: DocumentType;
  rg?: string;
  address?: string;
  cep?: string;
  course?: string;
  department?: string;
  institutionId?: string;
  contactPhone?: string | null;
}

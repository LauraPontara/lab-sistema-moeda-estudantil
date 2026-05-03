import { BaseUserModel } from './user.model';

export interface StudentModel extends BaseUserModel {
  name: string;
  cpf: string;
  rg: string;
  address: string;
  course: string;
  institutionId: string;
}

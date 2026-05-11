import { BaseUserModel } from './user.model';

export interface ProfessorModel extends BaseUserModel {
  name: string;
  cpf: string;
  department: string;
  institutionId: string;
}

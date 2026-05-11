import { BaseUserModel } from './user.model';

export interface AdministratorModel extends BaseUserModel {
  administratorProfileId: string;
}

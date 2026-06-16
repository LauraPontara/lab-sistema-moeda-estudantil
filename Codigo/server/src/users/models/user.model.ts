import { UserRole } from '../../database/schemas';

export interface BaseUserModel {
  id: string;
  email: string;
  role: UserRole;
  coinBalance: number;
  whatsappPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserModel = BaseUserModel;

export interface AuthenticatedUser extends UserModel {
  passwordHash: string;
}

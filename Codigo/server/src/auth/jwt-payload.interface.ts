import { UserRole } from '../database/schemas';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

import { UserRole } from '../../database/schemas';

export class AuthResponseDto {
  accessToken!: string;
  user!: {
    id: string;
    email: string;
    role: UserRole;
    coinBalance: number;
  };
}

import { UserRole } from '../../database/schemas';

export interface CoinStatementEntryModel {
  id: string;
  amount: number;
  message: string;
  createdAt: Date;
  direction: 'IN' | 'OUT';
  counterpartId: string;
  counterpartName: string;
  counterpartEmail: string;
}

export interface CoinStatementModel {
  role: UserRole;
  balance: number;
  entries: CoinStatementEntryModel[];
}

export interface SendCoinsResponseModel {
  message: string;
  balance: number;
}

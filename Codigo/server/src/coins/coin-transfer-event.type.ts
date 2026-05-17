export interface CoinTransferEvent {
  transferId: string;
  amount: number;
  message: string;
  createdAt: string;
  professor: {
    id: string;
    name: string;
    email: string;
    balanceAfter: number;
  };
  student: {
    id: string;
    name: string;
    email: string;
    balanceAfter: number;
  };
}

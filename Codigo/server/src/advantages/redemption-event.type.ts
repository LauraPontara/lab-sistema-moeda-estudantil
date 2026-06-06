export interface RedemptionEvent {
  redemptionId: string;
  couponCode: string;
  redeemedAt: string;
  advantage: {
    id: string;
    title: string;
    costXp: number;
  };
  student: {
    id: string;
    name: string;
    email: string;
    whatsappPhone: string | null;
    balanceAfter: number;
  };
  company: {
    id: string;
    tradeName: string;
    email: string;
    whatsappPhone: string | null;
  };
}

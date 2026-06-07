import { randomBytes } from 'node:crypto';

export function generateCoupon(): string {
  return randomBytes(6).toString('hex').toUpperCase();
}

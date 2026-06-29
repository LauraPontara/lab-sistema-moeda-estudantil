import { randomBytes } from 'node:crypto';

function randomIndex(charset: string): string {
  const byte = randomBytes(1)[0];
  return charset[byte % charset.length];
}

export function generateTemporaryPassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%&*';
  const all = upper + lower + digits + symbols;

  const chars = [
    randomIndex(upper),
    randomIndex(lower),
    randomIndex(digits),
    randomIndex(symbols),
    ...Array.from({ length: 6 }, () => randomIndex(all)),
  ];

  // Fisher-Yates shuffle using crypto random bytes
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

import { generateCoupon } from './coupon.util';

describe('generateCoupon', () => {
  it('gera um código de 12 caracteres hexadecimais maiúsculos', () => {
    expect(generateCoupon()).toMatch(/^[0-9A-F]{12}$/);
  });

  it('não colide ao longo de muitas gerações', () => {
    const total = 10000;
    const codes = new Set<string>();

    for (let i = 0; i < total; i++) {
      codes.add(generateCoupon());
    }

    expect(codes.size).toBe(total);
  });
});

export class NoDiscount {
  calculate(subtotal) {
    return subtotal;
  }
}

export class PercentageDiscount {
  constructor(percent) {
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      throw new RangeError("Discount percent must be between 0 and 100");
    }
    this.percent = percent;
  }

  calculate(subtotal) {
    return subtotal * (1 - this.percent / 100);
  }
}

function power(base, exponent) {
  if (typeof base !== "number" || typeof exponent !== "number") {
    console.log("base and exponent must be numbers");
    return null;
  }
  if (!Number.isInteger(exponent)) {
    console.log("exponent must be an integer");
    return null;
  }

  if (exponent === 0) return 1;
  if (exponent < 0) return 1 / power(base, -exponent);

  return base * power(base, exponent - 1);
}

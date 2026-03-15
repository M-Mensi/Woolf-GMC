/**
 * Calculates base^exponent recursively.
 * Supports integer exponents (positive, zero, negative).
 *
 * @param {number} base
 * @param {number} exponent
 * @returns {number}
 */
function power(base, exponent) {
  if (typeof base !== "number" || typeof exponent !== "number") {
    throw new TypeError("base and exponent must be numbers");
  }
  if (!Number.isInteger(exponent)) {
    throw new TypeError("exponent must be an integer");
  }

  if (exponent === 0) return 1;
  if (exponent < 0) return 1 / power(base, -exponent);

  return base * power(base, exponent - 1);
}

module.exports = { power };

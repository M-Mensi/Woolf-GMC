/**
 * Returns the nth Fibonacci number using recursion.
 * The sequence starts: 0, 1, 1, 2, 3, 5, 8...
 *
 * @param {number} n - zero-based index (0 => 0, 1 => 1)
 * @returns {number}
 */
function fibonacci(n) {
  if (typeof n !== "number" || !Number.isInteger(n) || n < 0) {
    throw new TypeError("n must be a non-negative integer");
  }

  if (n === 0) return 0;
  if (n === 1) return 1;

  return fibonacci(n - 1) + fibonacci(n - 2);
}

module.exports = { fibonacci };

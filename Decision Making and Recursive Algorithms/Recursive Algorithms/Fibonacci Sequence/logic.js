
function fibonacci(n) {
  if (typeof n !== "number" || !Number.isInteger(n) || n < 0) {
    console.log("n must be non-negative");
    return null;
  }

  if (n === 0) return 0;
  if (n === 1) return 1;

  return fibonacci(n - 1) + fibonacci(n - 2);
}

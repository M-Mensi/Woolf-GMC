/**
 * Returns ticket price based on age.
 *
 * @param {number} age
 * @returns {number}
 */
function ticketPrice(age) {
  if (typeof age !== "number" || !Number.isInteger(age) || age < 0) {
    throw new TypeError("age must be a non-negative integer");
  }

  if (age <= 12) return 10;
  if (age <= 17) return 15;
  return 20;
}

module.exports = { ticketPrice };

/**
 * Returns true if the given year is a leap year.
 * Leap years are divisible by 4, but not by 100 unless also divisible by 400.
 *
 * @param {number} year
 * @returns {boolean}
 */
function isLeapYear(year) {
  if (typeof year !== "number" || !Number.isInteger(year)) {
    throw new TypeError("year must be an integer");
  }

  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

module.exports = { isLeapYear };

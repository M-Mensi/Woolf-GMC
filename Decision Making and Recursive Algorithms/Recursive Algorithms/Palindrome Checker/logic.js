/**
 * Checks whether a string is a palindrome (recursive), ignoring spaces, punctuation, and capitalization.
 *
 * @param {string} input
 * @returns {boolean}
 */
function isPalindrome(input) {
  if (typeof input !== "string") {
    throw new TypeError("input must be a string");
  }

  // Normalize: remove non-alphanumeric characters and lowercase
  const normalized = input.toLowerCase().replace(/[^a-z0-9]/g, "");

  function check(left, right) {
    if (left >= right) return true;
    if (normalized[left] !== normalized[right]) return false;
    return check(left + 1, right - 1);
  }

  return check(0, normalized.length - 1);
}

module.exports = { isPalindrome };

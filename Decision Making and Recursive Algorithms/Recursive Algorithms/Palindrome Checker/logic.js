function isPalindrome(input) {
  if (typeof input !== "string") {
    console.log("input must be a string");
    return null;
  }

  const normalized = input.toLowerCase().replace(/[^a-z0-9]/g, "");

  function check(left, right) {
    if (left >= right) return true;
    if (normalized[left] !== normalized[right]) return false;
    return check(left + 1, right - 1);
  }

  return check(0, normalized.length - 1);
}

function isPalindrome(word) {
  if (typeof word !== "string") {
    throw new TypeError("word must be a string");
  }

  if (word.length <= 1) {
    return true;
  }

  if (word[0] !== word[word.length - 1]) {
    return false;
  }

  return isPalindrome(word.slice(1, -1));
}

module.exports = isPalindrome;

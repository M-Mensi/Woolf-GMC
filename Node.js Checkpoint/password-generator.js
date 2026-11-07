const generatePassword = require('generate-password');

const password = generatePassword.generate({
  length: 16,
  numbers: true,
  symbols: true,
  lowercase: true,
  uppercase: true,
});

console.log(password);

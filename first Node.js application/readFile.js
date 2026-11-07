const fs = require('fs');
const path = require('path');

const message = fs.readFileSync(path.join(__dirname, 'message.txt'), 'utf8');
console.log(message);
const fs = require('fs');
const path = require('path');

const directory = __dirname;
const welcomePath = path.join(directory, 'welcome.txt');
const helloPath = path.join(directory, 'hello.txt');

fs.writeFileSync(welcomePath, 'Hello Node\n', 'utf8');

const helloMessage = fs.readFileSync(helloPath, 'utf8');
console.log(helloMessage);

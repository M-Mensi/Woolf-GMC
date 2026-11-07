const http = require('http');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end('<h1>Hello Node!!!!</h1>\n');
});

server.listen(3000, () => {
  console.log('Server listening at http://localhost:3000');
});

'use strict';

const http = require('http');
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

http.createServer((req, res) => {

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
  });

  res.write('<h1>Mining for Goldstein!</h1>');
  res.end();

}).listen(port, host);

console.log(`App running at http://${host}:${port}`);
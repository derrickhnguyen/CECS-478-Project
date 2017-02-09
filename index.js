'use strict';

const http = require('http');
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

http.createServer((req, res) => {

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
  });

  res.write('<section style="text-align:center">');
  res.write('<h1>Mining for Goldstein!</h1>');
  res.write('<h1>Mike Black and Derrick Nguyen</h1>');
  res.write('<h1>CECS 478</h1>');
  res.write('</section>');
  res.end();

}).listen(port, host);

console.log(`App running at http://${host}:${port}`);
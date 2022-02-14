var http = require('http');

http.createServer(function (req, res) {
  res.write("I'm alive 10-8");
  res.end();
}).listen(8080);
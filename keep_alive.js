var http = require('http');

http.createServer(function (req, res) {
  res.write("Your Replit Ticket Bot By Murali Anand is Alive and ready to help!");
  res.end();
}).listen(8080);

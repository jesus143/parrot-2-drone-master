// Run this to receive a png image stream from your drone.
var arDrone    =  require('ar-drone');

var http    = require('http');

console.log('Connecting png stream ...');

var pngStream = arDrone.createClient().getPngStream();

var lastPng;
var counter = 0;

var data = {};

// var socket = io.connect('http://192.168.1.2:3000');


pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {

    console.log(" counter ", counter);

      counter++;

       lastPng = pngBuffer;

       data.png = pngBuffer;

      // socket.emit('chanel.drone-control', data);
  });

var server = http.createServer(function(req, res) {
  if (!lastPng) {
    res.writeHead(503);
    res.end('Did not receive any png data yet.');
    return;
  }

  res.writeHead(200, {'Content-Type': 'image/png'});
  res.end(lastPng);
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});


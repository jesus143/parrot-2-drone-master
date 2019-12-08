




//
// // main();
//
// // function main() {
// process.arDrone = require('ar-drone');
//
// // require('events').EventEmitter.prototype._maxListeners = 100;
//
// process.client  = process.arDrone.createClient();
// process.server  = require('http').Server();
// process.io      = require('socket.io')(process.server);
//
// // This will count how many frame are being passed
// process.frameCounter = 0;
//
// // This will be for the interval of the speed of data processing
// process.period        = 250; // This will trigger how many seconds to wait, until the next data is being passed to controller
// process.lastFrameTime = 0;
//
// // listen to 3000 port
// process.server.listen(3000);
//
// process.pngStopped = false;
//
//
//
// var options = {};
// options.timeout = 4000;
//
//
// process.pngStream = process.client.getPngStream(options);
//
//
//
// // data where the drone response stored
// process.data = {};
//
//
//
//
//
//
//
//
// //
// // var arDrone    =  require('ar-drone');
// var PaVEParser = require('ar-drone/lib/video/PaVEParser');
// // var output     = require('fs').createWriteStream('./vid.h264');
//
// var video    = process.client.getVideoStream();
// var parser   = new PaVEParser();
// // var client   = arDrone.createClient();
//
// var counter = 0;
// // process.server  = require('http').Server();
// // process.io      = require('socket.io')(process.server);
//
// var data = {};
//
//
// process.io.on('connection', function(socket) {
//
//
//     console.log("Test ");
//
//
//
//     parser
//       .on('data', function(h264) {
//
//           console.log("video passing started");
//
//           // exec('ffmpeg -i vid.h264 -vcodec copy out.mp4');
//
//           console.log("counter ", counter);
//
//           counter++;
//
//
//           // data.h264 = h264;
//           //
//           //
//           //  socket.emit('chanel.drone-image-frame', data);
//
//           // output.write(data.payload);
//
//       })
//       .on('end', function() {
//         output.end();
//       });
//
//       video.pipe(parser);
//
//
//     // parser
//     //   .on('data', function(h264) {
//     //       console.log(h264);
//     //
//     // });
//
//     // video.pipe(parser);
// });
// // }
//
//







// Run this to save a h264 video file, with the PaVE frame filtered out.
// You can then use this file as a ffmpeg source for additional processing
// or streaming to a ffserver

var arDrone    =  require('ar-drone');
var PaVEParser = require('ar-drone/lib/video/PaVEParser');
var output     = require('fs').createWriteStream('./vid.h264');

var video    = arDrone.createClient().getVideoStream();
var parser   = new PaVEParser();
var client   = arDrone.createClient();

var counter = 0;


var socket = io.connect('http://192.168.1.2:3000');

// this command can make the converted data to an video
// ffmpeg -i vid.h264 -vcodec copy out.mp4

console.log(" test started ");

     console.log("server started ");

    parser
      .on('data', function(h264) {

          console.log("video passing started");

          // exec('ffmpeg -i vid.h264 -vcodec copy out.mp4');

          console.log("counter ", counter);

          counter++;





          // data.h264 = h264;
          //
          //
          //  socket.emit('chanel.drone-image-frame', data);

          // output.write(data.payload);

      })
      .on('end', function() {
        output.end();
      });

      video.pipe(parser);


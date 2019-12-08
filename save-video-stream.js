// Run this to save a h264 video file, with the PaVE frame filtered out.
// You can then use this file as a ffmpeg source for additional processing
// or streaming to a ffserver

var arDrone =  require('ar-drone');
var PaVEParser = require('ar-drone/lib/video/PaVEParser');
var output = require('fs').createWriteStream('./vid.h264');

var video = arDrone.createClient().getVideoStream();
var parser = new PaVEParser();

var counter = 0;

parser
  .on('data', function(data) {


      console.log("counter ", counter);

      counter++;
    output.write(data.payload);
  })
  .on('end', function() {
    output.end();
  });

video.pipe(parser);

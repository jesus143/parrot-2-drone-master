// Run this to receive the raw video stream from your drone as buffers.

// var arDrone = require('..');
//
// var video = arDrone.createClient().getVideoStream();
//
// video.on('data', console.log);
// video.on('error', console.log);
//


var bebop = require("node-bebop"),
    fs = require("fs");

var output = fs.createWriteStream("./video.h264"),
    drone = bebop.createClient(),
    video = drone.getVideoStream();

video.pipe(output);

drone.connect();
drone.MediaStreaming.videoEnable(1); // this line should start video
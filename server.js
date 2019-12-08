
// main();

// function main() {
    process.arDrone = require('ar-drone');

    // require('events').EventEmitter.prototype._maxListeners = 100;

    process.client  = process.arDrone.createClient();
    process.server  = require('http').Server();
    process.io      = require('socket.io')(process.server);

    // This will count how many frame are being passed
    process.frameCounter = 0;

    // This will be for the interval of the speed of data processing
    process.period        = 250; // This will trigger how many seconds to wait, until the next data is being passed to controller
    process.lastFrameTime = 0;

    // listen to 3000 port
    process.server.listen(3000);

    process.pngStopped = false;



    var options = {};
    options.timeout = 4000;


    process.pngStream = process.client.getPngStream(options);



    // process.client.droneStream(server, options)

    //
    // process.pngStream = new arDrone.Client.PngStream(
    //     options
    // );




    // turn on gps
    process.client.config('general:navdata_options', 777060865);

    // data where the drone response stored
    process.data = {};

    process.io.on('connection', function(socket) {
        process.socket = socket;

        pngStreamVideo();
        initControl();

        // client.on('event', data => { /* … */ });
        // client.on('disconnect', () => { /* … */ });
    });
// }

function pngStreamVideo()
{

    process.pngStream
        .on('data', function(videoBuffer) {
            // adjust how many seconds in the interval
            process.now = (new Date()).getTime();
            if (process.now - process.lastFrameTime > process.period) {

                console.log("count ", process.frameCounter);

                process.data.png = videoBuffer;

                process.data.navdata = '';

                pngStreamPassDataToFrontEnd();

                pngStreamDetectStop();

                process.frameCounter++;

                process.lastFrameTime = process.now;
            }
        })
        .on('end', function () {
            console.log(" png end");
        })
        .on('stop', function () {
            console.log(" png stop");
        })
        .on('drain', function () {
            console.log(" png drain");
        })
        .on('exit', function () {
            console.log(" png exit");
        })
        .on('connect', function () {
            console.log(" png connect");
        })
        .on('timeout', function () {
            console.log(" png connect");
        })
        .on('error', console.log);
}

function pngStreamPassDataToFrontEnd()
{
    process.socket.emit('chanel.drone-image-frame', process.data);
}

function pngStreamDetectStop()
{
    clearTimeout(process.pngStopped);

    process.pngStopped = setTimeout(function(){
        console.log("video stoped, now restarting server");

    }, 1000);
}

function initControl() {
    process.socket.on('chanel.drone-control', function (control) {
        console.log(" new control triggered ", control);

        if(control.action == 'left') {
            console.log("left");
            process.client.counterClockwise(0.5);
        }
        else if(control.action == 'right') {
            process.client.clockwise(0.5);
            console.log("right");
        }
        else if(control.action == 'down') {
            console.log("down");
            process.client.down(3)
        }
        else if(control.action == 'up') {
            console.log("up");
            process.client.up(3)
        }
        else if(control.action == 'back') {
            console.log("back");
            process.client.back(3)
        }
        else if(control.action == 'front') {
            console.log("front");

            process.client.front(3)
        }
        if(control.action == 'fly') {
            console.log(" fly");

            // client.takeoff();
        }
        else if(control.action == 'land') {
            console.log(" landing");
            process.client.stop();
            process.client.land();
        }
        if(control.action == 'topvideo') {

            console.log(" top video");
            process.client.config('video:video_channel', 0);
        } else if(control.action == 'bottomvideo') {

            console.log(" bottom video");

            process.client.config('video:video_channel', 3);
        }
    });
}


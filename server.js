
main();

function main() {
    var arDrone = require('ar-drone');

    // require('events').EventEmitter.prototype._maxListeners = 100;

    var client  = arDrone.createClient();
    var server  = require('http').Server();
    var io      = require('socket.io')(server);

    // This will count how many frame are being passed
    var frameCounter = 0;

    // This will be for the interval of the speed of data processing
    var period        = 10; // This will trigger how many seconds to wait, until the next data is being passed to controller
    var lastFrameTime = 0;

    // listen to 3000 port
    server.listen(3000);

    var pngStopped = false;

    var pngStream = client.getPngStream();

    // turn on gps
    client.config('general:navdata_options', 777060865);

    // data where the drone response stored
    var data = {};

    io.on('connection', function(socket) {
        initControl(socket, client);
        pngStreamVideo(pngStream, frameCounter);

        // client.on('event', data => { /* … */ });
        // client.on('disconnect', () => { /* … */ });
    });
}

function pngStreamVideo(pngStream, frameCounter)
{
    pngStream
        .on('data', function(videoBuffer) {
            // adjust how many seconds in the interval
            var now = (new Date()).getTime();
            if (now - lastFrameTime > period) {

                console.log("count ", frameCounter);

                data.png = videoBuffer;

                data.navdata = '';

                pngStreamPassDataToFrontEnd(data);

                pngStreamDetectStop();

                frameCounter++;

                lastFrameTime = now;
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
        .on('error', function(error){
            console.log(" error ", error);
        })

}

function pngStreamPassDataToFrontEnd(data)
{
    socket.emit('chanel.drone-image-frame', data);
}

function pngStreamDetectStop()
{
    clearTimeout(pngStopped);

    pngStopped = setTimeout(function(){
        console.log("video stoped, now restarting server");
        server.close();
        main();

    }, 1000);
}

function initControl(socket, client) {
    socket.on('chanel.drone-control', function (control) {
        console.log(" new control triggered ", control);

        if(control.action == 'left') {
            console.log("left");
            client.counterClockwise(0.5);
        }
        else if(control.action == 'right') {
            client.clockwise(0.5);
            console.log("right");
        }
        else if(control.action == 'down') {
            console.log("down");
            client.down(3)
        }
        else if(control.action == 'up') {
            console.log("up");
            client.up(3)
        }
        else if(control.action == 'back') {
            console.log("back");
            client.back(3)
        }
        else if(control.action == 'front') {
            console.log("front");

            client.front(3)
        }
        if(control.action == 'fly') {
            console.log(" fly");

            // client.takeoff();
        }
        else if(control.action == 'land') {
            console.log(" landing");
            client.stop();
            client.land();
        }
        if(control.action == 'topvideo') {

            console.log(" top video");
            client.config('video:video_channel', 0);
        } else if(control.action == 'bottomvideo') {

            console.log(" bottom video");

            client.config('video:video_channel', 3);
        }
    });
}


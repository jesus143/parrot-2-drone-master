var arDrone = require('ar-drone');

    // require('events').EventEmitter.prototype._maxListeners = 100;

  var client  = arDrone.createClient();
   var server  = require('http').Server();
   var io      = require('socket.io')(server);

    // This will count how many frame are being passed
    frameCounter = 0;

    // This will be for the interval of the speed of data ng
    period        = 250; // This will trigger how many seconds to wait, until the next data is being passed to controller
    lastFrameTime = 0;

    // listen to 3000 port
    server.listen(3000);

    pngStopped = false;

    var options = {};

    options.timeout = 4000;

    var pngStream = client.getPngStream(options);
    //
    // turn on gps
    client.config('general:navdata_options', 777060865);

    // data where the drone response stored
    data = {};

    console.log(" server started.. ");

    io.on('connection', function(socket) {
        // socket = socket;


        console.log(" connected... ");
        //
        // pngStreamVideo();
        // initControl();




        pngStream
            .on('data', function(videoBuffer) {


                console.log(" video buffer .. ");

                // adjust how many seconds in the interval
                now = (new Date()).getTime();
                if (now - lastFrameTime > period) {

                    console.log("count ", frameCounter);

                    // console.log(" png ", videoBuffer);

                    console.log(videoBuffer);

                    var myObjects;





                    // videoBuffer.keys(myObjects).forEach(function (element, key, array) {
                    //
                    //
                    //     // var data = o[key];
                    //
                    //
                    //     console.log(" data ", key);
                    // });



                    data.png = videoBuffer;

                    data.navdata = '';

                    // console.log(" png ", videoBuffer);

                    data.png = videoBuffer;

                    data.navdata = '';

                    socket.emit('chanel.drone-image-frame', data);


                    clearTimeout(pngStopped);

                    pngStopped = setTimeout(function(){
                        console.log("video stoped, now restarting server");

                    }, 1000);




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
            .on('error', console.log);




        socket.emit('chanel.drone-image-frame', data);
    });



    //
    function pngStreamVideo()
    {

    pngStream
        .on('data', function(videoBuffer) {


            console.log(" video buffer .. ");

            // adjust how many seconds in the interval
            now = (new Date()).getTime();
            if (now - lastFrameTime > period) {

                // console.log("count ", frameCounter);



                console.log(" png ", videoBuffer);



                data.png = videoBuffer;

                data.navdata = '';

                pngStreamPassDataToFrontEnd();

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
        .on('error', console.log);
    }

    function pngStreamPassDataToFrontEnd()
    {
        socket.emit('chanel.drone-image-frame', data);
    }

    // function pngStreamDetectStop()
    // {
    // clearTimeout(pngStopped);
    //
    // pngStopped = setTimeout(function(){
    //     console.log("video stoped, now restarting server");
    //
    // }, 1000);
    // }
    //
    // function initControl() {
    // socket.on('chanel.drone-control', function (control) {
    //     console.log(" new control triggered ", control);
    //
    //     if(control.action == 'left') {
    //         console.log("left");
    //         client.counterClockwise(0.5);
    //     }
    //     else if(control.action == 'right') {
    //         client.clockwise(0.5);
    //         console.log("right");
    //     }
    //     else if(control.action == 'down') {
    //         console.log("down");
    //         client.down(3)
    //     }
    //     else if(control.action == 'up') {
    //         console.log("up");
    //         client.up(3)
    //     }
    //     else if(control.action == 'back') {
    //         console.log("back");
    //         client.back(3)
    //     }
    //     else if(control.action == 'front') {
    //         console.log("front");
    //
    //         client.front(3)
    //     }
    //     if(control.action == 'fly') {
    //         console.log(" fly");
    //
    //         // client.takeoff();
    //     }
    //     else if(control.action == 'land') {
    //         console.log(" landing");
    //         client.stop();
    //         client.land();
    //     }
    //     if(control.action == 'topvideo') {
    //
    //         console.log(" top video");
    //         client.config('video:video_channel', 0);
    //     } else if(control.action == 'bottomvideo') {
    //
    //         console.log(" bottom video");
    //
    //         client.config('video:video_channel', 3);
    //     }
    // });
    // }
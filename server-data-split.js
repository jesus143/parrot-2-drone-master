var arDrone = require('ar-drone');

    // require('events').EventEmitter.prototype._maxListeners = 100;

   var client  = arDrone.createClient();
   var server  = require('http').Server();
   var io      = require('socket.io')(server);
   var sizeof  = require('object-sizeof');
   var fs      = require('fs');


// This will count how many frame are being passed
    var frameCounter = 0;

    // This will be for the interval of the speed of data ng
    var period        = 250; // This will trigger how many seconds to wait, until the next data is being passed to controller
    var lastFrameTime = 0;
    var pngStopped = false;

    // listen to 3000 port
    server.listen(3000);

    var options = {};

    var counter = 1;

    options.timeout = 4000;

    // var pngStream = client.getPngStream(options);
    //
    // turn on gps
    // client.config('general:navdata_options', 777060865);

    // data where the drone response stored
    var data = {};

    console.log(" server started..  1");

    var socket;

    io.on('connection', function(s) {
        console.log("server stated for connection..");

        // socket = s;

        navData();

        // socket.emit('chanel.drone-image-frame', data);
    });

    function navData() {
        console.log(" nav data");
            client.on('navdata', (navdata)=> {
                data.navdata = navdata;

                logSplitActualData(data);

                // console.log(navdata);
                // socket.emit('chanel.drone-nav-data', data);
        });
    }
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

    function pngStreamDetectStop()
    {
        clearTimeout(pngStopped);

        pngStopped = setTimeout(function(){
            console.log("video stoped, now restarting server");

        }, 1000);
    }

    function initControl()
    {
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

    function calculateSize() {
        // 2B per character, 6 chars total => 12B
        // console.log(sizeof({abc: 'def'}));

        // 8B for Number => 8B
        // console.log(sizeof(12345));

        var param = {
            'a': 1,
            'b': 2,
            'c': {
                'd': 4
            }
        };
        // 4 one two-bytes char strings and 3 eighth-bytes numbers => 32B
        console.log(sizeof(param));
    }

    function logSplitActualData(data) {
        console.log(" logging the data for the split");

        setTimeout(function() {

            // console.log( data.navdata);


            // nav data
            var demo                = data.navdata.demo;
            var droneState          = data.navdata.droneState;
            var header              = data.navdata.header;
            var sequenceNumber      = data.navdata.sequenceNumber;
            var visionDetect        = data.navdata.visionDetect;
            var visionFlag          = data.navdata.visionFlag;
            var navData             =  data.navdata;

            // console.log( navData.header);

            var content = " header: "  + navData.header + " \n " +
                          " batteryPercent:" + navData.demo.batteryPercentage  + " \n " +
                          " rotX tfloat32:" +  navData.demo.rotation.leftRight  + " \n " +
                          " rotY tfloat32: " +  navData.demo.rotation.frontBack  + " \n " +
                          " rotY tfloat32: " +  navData.demo.rotation.frontBack  + " \n " +
                          " altd tfloat32: " +  navData.demo.altitude  + " \n " +
                          " vx tfloat32: " +  navData.demo.xVelocity  + " \n " +
                          " vy float32: " +   navData.demo.yVelocity  + " \n " +
                          " vz float32: " +    navData.demo.zVelocity  + " \n ";
                // console.log(content);

            logWrite("DEAGGRIGATION", content);
            counter++;
        }, 1000);
    }

    function logSplit(data) {
        console.log(" logging the data for the split");

        setTimeout(function() {
            // nav data
            var demo                = data.navdata.demo;
            var droneState          = data.navdata.droneState;
            var header              = data.navdata.header;
            var sequenceNumber      = data.navdata.sequenceNumber;
            var visionDetect        = data.navdata.visionDetect;
            var visionFlag          = data.navdata.visionFlag;

            logWrite("DEAGGREGATED: Nav data - demo",           demo);
            logWrite("DEAGGREGATED: Nav data - droneState",    droneState);
            logWrite("DEAGGREGATED: Nav data - header",         header);
            logWrite("DEAGGREGATED: Nav data - sequenceNumber", sequenceNumber);
            logWrite("DEAGGREGATED: Nav data - visionDetect", visionDetect);
            logWrite("DEAGGREGATED: Nav data - visionFlag",    visionFlag);

             setTimeout(function() {
                logWrite("AGGREGATED: Nav data", data.navdata, 'last');
             }, 2);
            //
            counter++;
        }, 1000);
    }

    function logWriteActualValue(navData) {
        var content = '';

        content =
                  " -------------------------\n" +
                  " Number:" + counter + "\n" +
                  " Title :" + title + "\n" +
                  " Size: " + sizeof(data) + " bytes \n" +
                  " Attribute : " +  data  + "\n";

        return fs.appendFile('navdata-log-2019-12-11.txt', content, 'utf8', function (err) {
            if (err) throw err;

            if(type == 'last') {
                logWriteExtra("-----------------------------------------------------------\n");
            }
        });
    }


    function logWrite(title, data, type) {
        var content = '';


        console.log(data);
        content =
                  " -------------------------\n" +
                  // " Number:" + counter + "\n" +
                  " Title :" + title + "\n" +
                  " Size: " + sizeof(data) + " bytes \n" +
                  " Attribute : " +  data  + "\n";

        return fs.appendFile('navdata-log-2019-12-11.txt', content, 'utf8', function (err) {
            if (err) throw err;

            if(type == 'last') {
                logWriteExtra("-----------------------------------------------------------\n");
            }
        });
    }

    function logWriteExtra(content) {
        fs.appendFile('navdata-log-2019-12-11.txt', content, 'utf8', function (err) {
            if (err) throw err;

            console.log('extra created! ', content);
        });
    }
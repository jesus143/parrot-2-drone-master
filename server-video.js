
     arDrone = require('ar-drone');

    // require('events').EventEmitter.prototype._maxListeners = 100;

    client  = arDrone.createClient();
    server  = require('http').Server();
    io      = require('socket.io')(server);

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



     // in node:
     //
     // note that the 'server' object points to a server instance and NOT an express app.
     require("dronestream").listen(server);
     // if your drone is on a different IP
     // require("dronestream").listen(server, { ip: "192.168.2.155" });
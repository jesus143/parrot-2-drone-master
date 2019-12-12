const http = require("http");
const drone = require("dronestream");

const server = http.createServer(function(req, res) {
    require("fs").createReadStream(__dirname + "/public/video.html").pipe(res);
});

drone.listen(server);

server.listen(3000);

var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var io      = require('socket.io')(server);

client.config('general:navdata_options', 777060865);

var data = {};

io.on('connection', function(socket) {

    initControl(socket);

    client.on('navdata', (navdata)=> {
        data.navdata = navdata;

        socket.emit('chanel.drone-nav-data', data);
    });
});


function initControl(socket) {
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
const http = require("http");
const fs = require("fs");
const drone = require("dronestream");
var sizeof  = require('object-sizeof');

const server = http.createServer(function(req, res) {
    require("fs").createReadStream(__dirname + "/public/video.html").pipe(res);
});

drone.listen(server);

server.listen(3000);

var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var io      = require('socket.io')(server);

client.config('general:navdata_options', 777060865);
client.config('general:enable_navdata_time', true);
client.config('general:enable_navdata_wind_speed', true);

var data = {};
var deaggregated = {};
var aggregated = {};
var pocket = 2;

io.on('connection', function(socket) {
    initControl(socket);

    client.on('navdata', (navdata)=> {
        data.navdata     = navdata;
        data.deaggregated = deaggrateSocket(navdata);

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




 // AGGREGATE AND DEAGGREGATE NAV DATA
function deaggrateSocket(navdata) {
    deaggregated.header            =  deaggregateSocketCalculate(navdata.header);
    deaggregated.batteryPercentage =  deaggregateSocketCalculate(navdata.demo.batteryPercentage);
    deaggregated.leftRight         =  deaggregateSocketCalculate(navdata.demo.rotation.leftRight);
    deaggregated.frontBack         =  deaggregateSocketCalculate(navdata.demo.rotation.frontBack);
    deaggregated.yaw               =  deaggregateSocketCalculate(navdata.demo.rotation.yaw);
    deaggregated.altitude          =  deaggregateSocketCalculate(navdata.demo.altitude);
    deaggregated.xVelocity         =  deaggregateSocketCalculate(navdata.demo.xVelocity);
    deaggregated.yVelocity         =  deaggregateSocketCalculate(navdata.demo.yVelocity);
    deaggregated.zVelocity         =  deaggregateSocketCalculate(navdata.demo.zVelocity);


    logWrite(deaggregated, 'DEAGGREGATE');

    aggrateSocket(deaggregated)

    return deaggregated;
}


function aggrateSocket(deaggregated) {
     aggregated.header            =  aggregateSocketCalculate(deaggregated.header);
     aggregated.batteryPercentage =  aggregateSocketCalculate(deaggregated.batteryPercentage);
     aggregated.leftRight         =  aggregateSocketCalculate(deaggregated.leftRight);
     aggregated.frontBack         =  aggregateSocketCalculate(deaggregated.frontBack);
     aggregated.yaw               =  aggregateSocketCalculate(deaggregated.yaw);
     aggregated.altitude          =  aggregateSocketCalculate(deaggregated.altitude);
     aggregated.yVelocity         =  aggregateSocketCalculate(deaggregated.yVelocity);
     aggregated.zVelocity         =  aggregateSocketCalculate(deaggregated.zVelocity);
    // console.log(aggregated);
    logWrite(aggregated, 'AGGREGATE');

    return aggregated;
}

function logWrite(data, title) {
    var content = '';

    content =
        title + "\n" +
        // "size:"  + sizeof(data.header) + "\n" +
        "header: " + data.header + "\n" +
        "batteryPercentage: " + data.batteryPercentage + "\n" +
        "leftRight: " + data.leftRight + "\n" +
        "frontBack: " + data.frontBack + "\n" +
        "yaw: " + data.yaw + "\n" +
        "altitude: " + data.altitude + "\n" +
        "yVelocity: " + data.yVelocity + "\n" +
        "zVelocity: " + ": " + data.zVelocity + "\n" +
        "--------------------------------------------------\n";

    return fs.appendFile('navdata-log-2019-12-11.txt', content, 'utf8', function (err) {
        if (err) throw err;

        // if(type == 'last') {
        //     logWriteExtra("-----------------------------------------------------------\n");
        // }
    });
}


function aggregateSocketCalculate(a) {

    let _this = this;
    let b = pocket;
    let c = 0; 

    // if(a < b) {
    //     c = a;
    // } else if(a > b) {
    c =  a * b;
    // } else {
    //     c = a;
    // }

    return c;
}


function deaggregateSocketCalculate(a) {
    let b = pocket;
    let c = 0;

    // if(a < b) {
    //     c = a;
    // } else if(a > b) {
        c = a / b;
    // } else {
    //     c = a;
    // }

    return c;
}
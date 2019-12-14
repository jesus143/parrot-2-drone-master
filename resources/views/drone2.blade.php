<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="/css/bootstrap.min.css">
    <title>DRONE MONITORING</title>
      <style>
          .room { 
              border:1px solid #a5a5a5;
              min-height: 300px;
              padding:5px;
          }
          
          .ctrl-button { 
              padding:10px;
              width:32%;
          }
      
          
          .table td {
              padding:0px;
          }
          
          .img {
              width: 100%;
          }

        /* map */
        .mapouter { 
            height:500px;
            width:100% !important;
          }
          .gmap_canvas {
              overflow:hidden;
              background:none!important;
              height:500px;
              width:100% !important;
          }
          
          .gmap_canvas iframe { 
               width:100%;
               height: 500px; 
          }

          .center {

              margin-top:20%;
              margin-left: 20%;
          }
          .container1 {
              padding: 0px;
              width: 1301px !important;
              margin: auto;
          }
      </style>
  </head>
  <body>
      <div class="container1 mt-2" style="padding: 0px"  id="app">
      <h4>DRONE MONITORING</h4>

      <div class="row">
        <div class="col-sm-6 room" >
            <iframe class="center"  src="http://localhost:3000/" style="width: 100%;height: 100%; margin:auto 0px !important;"> </iframe>
        </div>
        <div class="col-sm-6 room">
            <div class="container">
                <div class="form-group mt-3">
                    <button type="button" class="btn btn-success ctrl-button" v-on:click=greet("fly")  >Fly</button>
                    <button type="button" class="btn btn-danger ctrl-button" v-on:click=greet("land") >Land</button>
                </div>

                <hr>

                <div class="form-group">
                    <button type="button" class="btn btn-info ctrl-button" v-on:click=greet("right") >RIGHT</button>
                    <button type="button" class="btn btn-info ctrl-button" v-on:click=greet("front") >FORWARD</button>
                    <button type="button" class="btn btn-info ctrl-button" v-on:click=greet("left") >LEFT</button>
                </div>

                <div class="form-group">
                    <button type="button" class="btn btn-info ctrl-button" v-on:click=greet("down") >DOWN</button>
                    <button type="button" class="btn btn-info ctrl-button"  v-on:click=greet("up") >UP</button>
                    <button type="button" class="btn btn-info ctrl-button" v-on:click=greet("back") >BACK</button>
                </div>

                <hr>

                <div class="form-group mt-3">
                    <button type="button" class="btn btn-outline-success" v-on:click=greet("topvideo") >TOP CAMERA</button>
                    <button type="button" class="btn btn-outline-warning" v-on:click=greet("bottomvideo") >BOTTOM CAMERA</button>
                </div>

                <hr>

              <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th scope="col head-flying" >Control</th>
                      <th scope="col">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Control</td>
                      <td>up</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>flying</td>
                    </tr>
                      <tr>
                      <td>Camera</td>
                      <td>top</td>
                    </tr>

              </tbody>
            </table>


            </div>
        </div>
          <div class="col-sm-6 room">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th scope="col">NavData</th>
                  <th scope="col">Type</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>@{{ aggregated.header }}</td>
                  <td>Header</td>
                  <td>ROS header</td>
                </tr>
                <tr>
                  <td>@{{ aggregated.batteryPercentage }}</td>
                  <td>float32</td>
                  <td>0% to 100%</td>
                </tr>
                <tr>
                  <td>@{{ aggregated.leftRight }}</td>
                  <td>float32</td>
                  <td>left/right tilt</td>
                </tr>
                <tr>
                  <td>@{{ aggregated.frontBack }}</td>
                  <td>float32</td>
                  <td>forward/backward tilt</td>
                </tr>
                <tr>
                  <td>@{{ aggregated.yaw }}</td>
                  <td>float32</td>
                  <td>orientation, yaw</td>
                </tr>
                <tr>
                  <td>@{{ aggregated.altitude }}</td>
                  <td>float32</td>
                  <td>estimated altitude</td>
                </tr>
                <tr>
                  <td>@{{ aggregated.xVelocity }}</td>
                  <td>float32</td>
                  <td>linear x velocity</td>
                </tr>
                <tr>
                  <td>@{{  aggregated.yVelocity }}</td>
                  <td>float32</td>
                  <td>linear y velocity</td>
                </tr>
                <tr>
                  <td>@{{ aggregated.zVelocity }}</td>
                  <td>float32</td>
                  <td>linear z velocity</td>
                </tr>
                <tr>
                  <td>accx</td>
                  <td>float32</td>
                  <td>body x acceleration</td>
                </tr>
                <tr>
                  <td>accy</td>
                  <td>float32</td>
                  <td>body y acceleration</td>
                </tr>
                <tr>
                  <td>accz</td>
                  <td>float32</td>
                  <td>body z acceleration</td>
                </tr>
                <tr>
                  <td>gyrox</td>
                  <td>float32</td>
                  <td>angle rate about x axis</td>
                </tr>
                <tr>
                  <td>gyroy</td>
                  <td>float32</td>
                  <td>angle rate about y axis</td>
                </tr>
                <tr>
                  <td>gyroz</td>
                  <td>float32</td>
                  <td>angle rate about x axis</td>
                </tr>
                <tr>
                  <td>tm</td>
                  <td>float32</td>
                  <td>time stamp from ardrone</td>
                </tr>
              </tbody>
            </table>

        </div>
           <div class="col-sm-6 room" >
              <div class="mapouter">
                  <div class="gmap_canvas">
                      <h1> MAP </h1>
                        <!--  <iframe style="" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=iligan%20city%20philippines&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                      <a href="https://www.divi-discounts.com"></a> -->
                  </div>
               </div>
           </div>
        </div>
          {{--<pre>--}}
              {{--@{{ navData }}--}}
          {{--</pre>--}}
    </div>


    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/vue.js"></script>
    <script src="/js/socket.io.js"></script>

      <script>
    var socket = io.connect('http://192.168.1.2:3000');

    var app = new Vue({
        el: '#app',
        data: {
            navDataHere: {},
            navData: {
                demo : {
                },
                droneState : {

                },
                header : 0,
                sequenceNumber: 0,
                visionDetect: 0,
                visionFlag: 0
            },

            video_png:'img/frame.png',

            aggregated: {
                header:0,
                batteryPercentage:0,
                leftRight:0,
                frontBack:0,
                yaw:0,
                altitude:0,
                xVelocity:0,
                yVelocity:0,
                zVelocity:0,
            },

            deaggregate: {},

            // aggregate
            pocket:2

    },

        mounted() {
            let _this = this;

            socket.on('chanel.drone-nav-data', function (data) {
                // console.log("navdate", data);

                _this.navData = data.navdata;

                _this.aggregated = _this.aggrateSocket(data.deaggregated);
            });
        },

        methods: {
            aggrateSocket(deaggregated) {
                //console.log(deaggregated);

                let _this = this;

                let aggregated = {};

                aggregated.header            =  _this.aggregateSocketCalculate(deaggregated.header);
                aggregated.batteryPercentage =  _this.aggregateSocketCalculate(deaggregated.batteryPercentage);
                aggregated.leftRight         =  _this.aggregateSocketCalculate(deaggregated.leftRight);
                aggregated.frontBack         =  _this.aggregateSocketCalculate(deaggregated.frontBack);
                aggregated.yaw               =  _this.aggregateSocketCalculate(deaggregated.yaw);
                aggregated.altitude          =  _this.aggregateSocketCalculate(deaggregated.altitude);
                aggregated.xVelocity         =  _this.aggregateSocketCalculate(deaggregated.xVelocity);
                aggregated.yVelocity         =  _this.aggregateSocketCalculate(deaggregated.yVelocity);
                aggregated.zVelocity         =  _this.aggregateSocketCalculate(deaggregated.zVelocity);

                return aggregated;
            },

             aggregateSocketCalculate(a) {
                let _this = this;
                let b = _this.pocket;
                let c = 0;

                 // if(a < b) {
                 //     c = a;
                 // } else if(a > b) {
                 c = a * b;
                 // } else {
                 //     c = a;
                 // }

                return c;
            },

              greet: function(action) {
                let isFly = false;

                // console.log("|te" + control);
                let control = {
                    'action' : action
                }

                if(action == 'fly') {
                    isFly = confirm("ARE YOU SURE, YOU WANT TO FLY THIS DRONE?");

                    if(isFly) {
                        socket.emit('chanel.drone-control', control);
                    }
                } else {
                    // alert(" send socket");
                    socket.emit('chanel.drone-control', control);
                }
            }
        }
    });
</script>
</html>
//Environment Setup
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
users = [];
connections = [];
//FireBase Setup
var rootURL = "https://unisoundpower.firebaseio.com";
var firebase = require("firebase");
firebase.initializeApp({databaseURL: rootURL});
var db = firebase.database();
var ref = db.ref("/channels");
//Heroku Node Setup
app.use(express.static(__dirname + ''));
app.set('views', __dirname + '');
app.set('view engine', 'html');
// socket
io.on('connection', function(socket){
  console.log('a user connected');
  for(var x = 0; x < 10;x++){console.log('FINALLYYYYYYY');}
});
io.sockets.on('connection', function(socket){
    for(var x = 0; x < 10;x++){console.log('FINALLYYYYYYY');}
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    // Disconnect
    socket.on('disconnect', function(data){
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected: %s sockets connected', connections.length);
    });
});
//REST
app.get('/', function(request, response) {response.sendFile(__dirname + '/index.html');});
app.get('/getChannelScript', function (req, res) {res.status(200).send(channel_script);});
app.get('/getRainbowColorArray', function (req, res) {res.status(200).send(rainbow_array);});
app.get('/getChannelsArray', function (req, res) {
  ref.on("value", function(snapshot) {
    channels_array = [];
    for(var channel in snapshot.val()) channels_array.push(channel);
    res.status(200).send(channels_array);
  }, function (errorObject) {
    res.status(400).send("The read failed: " + errorObject.code);
    console.log("The read failed: " + errorObject.code);
  });
});
app.get('/getMessage/:channel', function (req, res) {
  //Navigate to according channel
  var sub_channel_ref = ref.child(req.params.channel);
  console.log('Getting Channel [' + req.params.channel +'] message .......');
  // grab specific channel detail
  sub_channel_ref.on("value", function(snapshot) {
      console.log(snapshot.val());
      res.status(200).json(snapshot.val());
  }, function (errorObject) {
      res.status(400).send("The read failed: " + errorObject.code);
      console.log("The read failed: " + errorObject.code);
  });
});

//Local Data
// var channels_array = ['Sports','Movie','Food','Finance','Politics','Travel','Cars','Shopping','Career'];
var channels_array = [];
var rainbow_array = ['#EE6352','#E7386F','orangered','gold','#84DD63','#89FC00','#5ADBFF'];
var channel_script  = "<div title = 'error' id = 'error' class='channel col-lg-4 col-md-4 col-sm-4 col-xs-4' onclick='zoneTravel(2,this)'><div class='channel-top'></div><div class='channel-bottom'><div class='channel-avatar'><div class='channel-avatar-top'></div><div class='channel-avatar-bottom'></div></div></div></div>"
//Port Settings
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

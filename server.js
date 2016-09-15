//Environment Setup
var express = require('express');
var app = express();
// Socket.io Setup
var users,connections = [];
var http = require('http').Server(app);
var io = require('socket.io')(http);
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
	connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    // Disconnect
    socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
    });
	//socket.io Functions
	socket.on('register message', function(msg){
		msg.message = processEmoticon(msg.message);
		var internal_message_wrapper = {};
	    internal_message_wrapper[getTimeStamp()] = {
	        "detail" : msg.message,
	        "sender" : msg.signature
	    };
		console.log('registering: ');console.log(msg);
		ref.child(msg.channel).update(internal_message_wrapper);
		io.emit('new message',msg);
	});
});
//REST
app.get('/forceUpdate', function (req, res) {io.emit('force update',true);res.send(true)});
app.get('/', function(request, response) {response.sendFile(__dirname + '/index.html');});
app.get('/getChannelScript', function (req, res) {res.status(200).send(channel_script);});
app.get('/getRainbowColorArray', function (req, res) {res.status(200).send(rainbow_array);});
app.get('/getTime', function (req, res) {res.status(200).send(getTimeStamp())});
//Local Data
// var channels_array = ['Sports','Movie','Food','Finance','Politics','Travel','Cars','Shopping','Career'];
var channels_array = [];
var rainbow_array = ['#EE6352','#E7386F','orangered','gold','#84DD63','#89FC00','#5ADBFF'];
var channel_script  = "<div title = 'error' id = 'error' class='channel col-lg-4 col-md-4 col-sm-4 col-xs-4' onclick='userRequestZoneTravel(2,this)'><div class='channel-top'></div><div class='channel-bottom'><div class='channel-avatar'><div class='channel-avatar-top'></div><div class='channel-avatar-bottom'></div></div></div></div>"
// Ultility Functions
function processEmoticon(word){
	while(word.includes("<3") == true)  word = word.replace("<3", "&#x1f60d;");
    if(word.includes(":") == false && word.includes(";") == false) return word.trim();
	while(word.includes("3:)") == true)  word = word.replace("3:)", "&#x1f608;");
	while(word.includes("O:)") == true)  word = word.replace("O:)", "&#128519;");
    while(word.includes("o:)") == true)  word = word.replace("o:)", "&#128519;");
    while(word.includes("0:)") == true)  word = word.replace("0:)", "&#128519;");
	while(word.includes(":)") == true)  word = word.replace(":)", "&#128512;");
	while(word.includes(":-)") == true)  word = word.replace(":-)", "&#128512;");
	while(word.includes(":x") == true)  word = word.replace(":x", "&#128566;");
	while(word.includes(":X") == true)  word = word.replace(":X", "&#128566;");
	while(word.includes(":-X") == true)  word = word.replace(":-X", "&#128566;");
    while(word.includes(":-x") == true)  word = word.replace(":-x", "&#128566;");
    while(word.includes(":(") == true)  word = word.replace(":(", "&#128546;");
    while(word.includes(";)") == true)  word = word.replace(";)", "&#128521;");
    while(word.includes(":|") == true)  word = word.replace(":|", "&#128529;");
    while(word.includes(";0") == true)  word = word.replace(";0", "&#128562;");
	while(word.includes(";o") == true)  word = word.replace(";o", "&#128562;");
    while(word.includes(";O") == true)  word = word.replace(";O", "&#128562;");
    while(word.includes(":0") == true)  word = word.replace(":0", "&#128562;");
	while(word.includes(":o") == true)  word = word.replace(":o", "&#128562;");
	while(word.includes(":O") == true)  word = word.replace(":O", "&#128562;");
	while(word.includes(":3") == true)  word = word.replace(":3", "&#x1f63a;");
    while(word.includes(";3") == true)  word = word.replace(";3", "&#x1f63a;");
    return word.trim();
}
function getTimeStamp(){
    var d = new Date();
    var year  = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    var day   = d.getDate().toString();
    var hour  = d.getHours().toString();
    var minute= d.getMinutes().toString();
    var second= d.getSeconds().toString();
    var mili  = d.getMilliseconds().toString();
    //Space Filling
    if(month.length == 1) month = '0' + month;
    if(day.length == 1) day = '0' + day;
    if(hour.length == 1) hour = '0' + hour;
    if(minute.length == 1) minute = '0' + minute;
    if(second.length == 1) second = '0' + second;
    if(mili.length == 1) mili = '00' + mili;
    else if(mili.length == 2) mili = '0' + mili;
    // console.log(year);console.log(month);console.log(day);console.log(hour);console.log(minute);console.log(second);console.log(mili);
    return year + month + day + hour + minute + second + mili;
}

//Port Settings
app.set('port', (process.env.PORT || 5000));
http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//Environment Setup
var express = require('express');
var request = require("request");
var app = express();
// Socket.io Setup
var nickname = [], channels = [], connections = [];
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
// web socket
io.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected || %s registered users', connections.length, nickname.length);
	// register users
	socket.on('register user', function(username, response){
		console.log("Registering " + username);
        if(nickname.indexOf(username) != -1){
			response(false);
		}else{
			socket.nickname = username;
			nickname.push(username);
			response(true);
		}
		console.log('%s connected: %s sockets connected || %s registered users',username , connections.length, nickname.length);
		console.log(nickname);
	});
	// register channel
	socket.on('register channel', function(channel, response){
		socket.join(channel);
		socket.channel = channel;
		console.log(socket.nickname + ' has registered to: ' + channel);
	});
	// unregister channel
	socket.on('unregister channel', function(channel, response){
		socket.leave(channel);
		delete socket.channel;
		console.log(socket.nickname + ' has LEFT to: ' + channel);
	});
    // Disconnect
    socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1);
		nickname.splice(nickname.indexOf(socket.nickname),1);
		console.log('%s disconnected: %s sockets connected || %s registered users', socket.nickname, connections.length, nickname.length);
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
		ref.child(socket.channel).update(internal_message_wrapper);
		io.to(socket.channel).emit("new message", msg);
	});
	socket.on('request channels', function(name){
		ref.on("value",function(snapshot){
	        var internal_channels = [];
	        for(var one in snapshot.val()) internal_channels.push(one);
			channels = internal_channels;
			socket.emit('distribute channels',internal_channels);
	    },function(errorObject) {
	        console.log("The read failed: " + errorObject.code);
	    });
	});
	socket.on('request channel message', function(channel_name){
		ref.child(channel_name).on("value", function(snapshot){
			socket.emit("distribute channel message",snapshot.val());
	    },function(errorObject){
	        console.log('cannot get messages from: ' + channelRequest);
	    });
	});
	socket.on('create new channel', function(fullChannelName, response){
		var newChannelName = fullChannelName.slice(0,fullChannelName.indexOf(":"));
		console.log(newChannelName + ' ' + channels.indexOf(newChannelName));
		if(channels.indexOf(newChannelName) == -1){
			//Constructing JSON
			var internalChannelWrapper = {};
			var i =
			internalChannelWrapper[getTimeStamp()] = {
				"detail" : "Chat " + newChannelName + " created",
		        "sender" : "UniSound Team"
		    };
			ref.child(fullChannelName).update(internalChannelWrapper);
			if(channels.indexOf(newChannelName) == -1)
				channels.push(newChannelName);
			console.log("New Channel Created: " + newChannelName);
			return;
		}
		console.log("Channel Pre-Exists: " + newChannelName);
	});
	function requestChannels(){
		ref.on("value",function(snapshot){
	        var internal_channels = [];
	        for(var one in snapshot.val()) internal_channels.push(one);
			channels = internal_channels;
			console.log("FireBase: \n");
			console.log(channels);
	    },function(errorObject) {
	        console.log("The read failed: " + errorObject.code);
	    });
	}
});
//RESTful APIs
app.get('/', function(request, response) {response.sendFile(__dirname + '/index.html');});
app.get('/forceUpdate', function (req, res) {io.emit('force update',true);res.send(true);for(var x=0;x<10;x++)console.log("Force Updating");});
app.get('/connections', function (req, res) {res.send('Connected: ' + connections.length + ' sockets connected || ' + nickname.length + ' registered users')});
app.get('/channels', function (req, res) {res.send('Channels:\n ' + channels)});
app.get('/getChannelScript', function (req, res) {res.status(200).send(channel_script);});
app.get('/getRainbowColorArray', function (req, res) {res.status(200).send(rainbow_array);});
app.get('/getTime', function (req, res) {res.status(200).send(getTimeStamp())});
app.get('/resetDB', function (req, res) {
	console.log('Database Cleared & Reset');
	ref.set({
		placeholder:'Johnson Han'
	});
	res.status(200).send('Delete All Rooms Request Sent');
});
//Local Data
// var channels_array = ['Sports','Movie','Food','Finance','Politics','Travel','Cars','Shopping','Career'];
var channels_array = [];
var rainbow_array = ['#EE6352','#E7386F','orangered','gold','#84DD63','#89FC00','#5ADBFF'];
var channel_script  = "<div title = 'error' id = 'error' class='channel col-lg-4 col-md-4 col-sm-4 col-xs-12' onclick='userRequestZoneTravel(2,this)'><div class='channel-top'></div><div class='channel-bottom'><div class='channel-avatar'><div class='channel-avatar-top'></div><div class='channel-avatar-bottom'></div></div></div></div>"
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
// Text Razor API
var textRazorPostDetails = {
	method: 'POST',
	url: 'https://api.textrazor.com/',
	dataType: "jsonp",
	headers:{
		'content-type': 'application/x-www-form-urlencoded',
		'postman-token': 'd14287bb-e0c3-c0df-edc2-5affcb63f6d8',
		'cache-control': 'no-cache',
		'x-textrazor-key': '8575c3145b6d62735f8747f95b7879e7dbc7e6f13fbece95618d90ca'
	},
	form: { extractors: 'entities', text: "error" }
};
app.get('/razor/:text', function (req, res) {
	console.log("=-=-=-=-=-=-=-=-=-");
	console.log("Razor: " + req.params.text);
	textRazorPostDetails.form = { extractors: 'entities', text: req.params.text };
	request(textRazorPostDetails, function (error, response, body) {
	    //error checking
	    if(error || body == null || body == undefined || body.includes('entities') == false){
		    res.send(false);
		    return;
	    }
	    // convert response body from string to JSON
	    body = JSON.parse(body).response.entities;
	    // Create new response object
	    var temp = {};
	    for(var x = 0;x < body.length;x++){
		    var type = body[x].type[0].toString();
		    var id = body[x].entityId.toString();
		    temp[type] = id;
	    }
	    console.log(temp);
	    res.json(temp);
	});
});

function textRazor(text){
	return temp;
}

//Port Settings
app.set('port', (process.env.PORT || 5000));
http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

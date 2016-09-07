//Environment Setup
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = []; 

//Heroku Node Setup
app.use(express.static(__dirname + ''));
app.set('views', __dirname + '');
app.set('view engine', 'html');

//REST
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html'); 
});


//Port Settings
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



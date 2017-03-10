var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

// listen to 'chat' messages
io.on('connection', function(socket){
    socket.on('chat', function(msg){
	io.emit('chat', msg);
    });
});

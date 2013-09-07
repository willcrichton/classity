var nodestatic = require('node-static');
var fs = new nodestatic.Server('./www');

var server = require('http').createServer(function(request, response) {
    request.addListener('end', function() {
        fs.serve(request, response);
    }).resume();
});

server.listen(7000);
var io = require('socket.io').listen(server);


// Adding a tab? You'll want to add a line like
//     tabTypes.push(require('name'));
// here, which will use the function called
//     exports.init(socket)
// defined in the name.js file.

var tabs = [];
//tabs.push(require('presentation'));
//tabs.push(require('whiteboard'));

io.sockets.on('connection', function(socket) {
    console.log('Someone connected');

    socket.on('ping', function(text) {
        console.log('Pinged: ' + text);
    });

    io.sockets.emit('ping');

    tabs.forEach(function(tab) {
        tabType.init(socket);
    });
});

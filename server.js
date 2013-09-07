var nodestatic = require('node-static');
var fs = new nodestatic.Server('./www');

var server = require('http').createServer(function(request, response) {
    request.addListener('end', function() {
        fs.serve(request, response);
    }).resume();
});

server.listen(7000);
var io = require('socket.io').listen(server);
var _ = require('underscore');

// Adding a tab? You'll want to add a line like
//     tabTypes.push(require('name'));
// here, which will use the function called
//     exports.init(socket)
// defined in the name.js file.

var tabs = [];
//tabs.push(require('presentation'));
//tabs.push(require('whiteboard'));

var ids = [];
function newID() {
    if(ids.length === 0) {
        ids.push('0');
        return '0';
    } else {
        var lastID = ids[ids.length-1];
        var id = (parseInt(lastID) + 1).toString();
        ids.push(id);
        return id;
    }
}

function usernames(id) {
    var sockets = io.sockets.clients(id);
    var names = _.map(sockets , function(socket) {
        var x;
        socket.get('username', function(err, val) {
            x = val;
        });
        return x;
    });
    console.log('Names: ' + names);
    return names;
}


function join(socket, admin) {
    return function(id, username) {
        socket.join(id);
        socket.set('id', id);
        socket.emit('joinedRoom', {'id':id, 'admin':admin});
        socket.set('username', username, function() {
            console.log('Set username ' + username);
            socket.broadcast.to(id).emit('clientsChanged', usernames(id));
        });
    };
}

io.sockets.on('connection', function(socket) {
    console.log('Someone connected');

    //socket.on('ping', function(text) {
    //    console.log('Pinged: ' + text);
    //});

    //socket.emit('ping');

    socket.on('joinRoom', join(socket, false));
    socket.on('newRoom', function() {
        var id = newID();
        console.log('New room ' + id);
        join(socket, true)(id);
    });
    socket.on('disconnect', function() {
        console.log('Someone left');
        socket.broadcast.to(socket.get('id')).emit('clientsChanged', usernames(id));
    });


    tabs.forEach(function(tab) {
        tabType.init(socket);
    });
});

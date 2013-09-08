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
    return _.pluck(sockets, 'username');
}

function profVideo(id) {
    var sockets = io.sockets.clients(id);
    var video;
    _.forEach(sockets, function(socket) {
        if (socket.admin) {
            video = socket.videoId;
        }
    });
    return video;
}

function profSSUrl(id) {
    var sockets = io.sockets.clients(id);
    var SSUrl, SSindex;
    _.forEach(sockets, function(socket) {
        if (socket.admin) {
            SSUrl = socket.SSUrl;
            SSindex = socket.SSindex;
        }
    });
    return SSUrl + '#slide=' + SSindex;
}

function getProf(id) {
    var sockets = io.sockets.clients(id);
    var prof;
    _.forEach(sockets, function(socket) {
        if (socket.admin) {
            prof = socket;
        }
    });
    return prof;
}

function join(socket, admin) {
    return function(id, username, adminOverride) {
        if(!admin && io.sockets.clients('room').length === 0) {
            socket.emit('joinedRoom', new Error('Cannot join lecture; room does not exist.'));
        }
        socket.join(id);
        socket.room = id;
        socket.username = username;
        if(adminOverride === undefined) {
            socket.admin = admin;
        } else {
            socket.admin = adminOverride;
        }

        console.log('Set username ' + username);
        socket.emit('joinedRoom', {
            'id':id,
            'admin':socket.admin,
            'clients': usernames(id),
            'profVideo': profVideo(id),
            'name': username,
            'SSUrl': profSSUrl(id) });
        socket.broadcast.to(id).emit('clientsChanged', usernames(id));
    };
}

function sendUpdatePresentation(socket) {
    io.sockets.in(socket.room).emit('updatePresentation', socket.SSUrl + '#slide=' + socket.SSindex);
}

io.sockets.on('connection', function(socket) {
    console.log('Someone connected');

    socket.on('joinRoom', join(socket, false));

    socket.on('newRoom', function(args) {
        var id = newID();
        console.log('New room ' + id);
        socket.SSUrl = args.presentation;
        socket.SSindex = 1;
        join(socket, true)(id, args.username);
    });

    socket.on('disconnect', function() {
        console.log('Someone left');
        var id = socket.room;

        // clientsLeft instead of changes b/c at this point socket list still includes leaver
        socket.broadcast.to(id).emit('clientsLeft', socket.username);
    });

    socket.on('videoId', function(id) {
        socket.broadcast.to(socket.room).emit('profVideo', id);
        socket.videoId = id;
    });

    socket.on('changeTab', function(tab) {
        socket.broadcast.to(socket.room).emit('changeTab', tab);
    });

    socket.on('setSlideShowUrl', function(SSUrl) {
        socket.SSUrl = SSUrl;
        socket.SSindex = 1;
        sendUpdatePresentation(socket);
    });

    socket.on('advanceSlide', function(increment) {
        socket.SSindex += increment;
        sendUpdatePresentation(socket);
    })

    socket.on('chat', function(message) {
        socket.broadcast.to(socket.room).emit('onChat', socket.username, message);
    });

    socket.on('askQuestion', function(question) {
        var prof = getProf(socket.room);
        if (prof) {
            prof.emit('questionAsked', socket.username, question);
        }
    });

    socket.on('giveAnswer', function(answer) {
        var prof = getProf(socket.room);
        if (prof) {
            prof.emit('answerGiven', socket.username, answer);
        }
    });

    tabs.forEach(function(tab) {
        tabType.init(socket);
    });
});

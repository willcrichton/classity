define(function(require) {
    'use strict';

    var 
    _        = require('Underscore'),
    Backbone = require('Backbone'),
    template = require('text!templates/lecture.tpl'),
    ControlsView = require('views/ControlsView');

    return Backbone.View.extend({
        id: 'lecture',

        events: {
            'click #name-update' : 'updateName',
            'click .nav-tabs a'  : 'updateTab',
            'submit #chatbox'    : 'chat'
        },

        initialize: function(options) {
            this.template = _.template(template);
            this.state = this.options.state;
            
            this.listenTo(this.state, 'change:clients', this.updateClients);
            this.listenTo(this.state, 'change:auth change:profVideo', this.render);
            this.listenTo(this.state, 'change:tab', this.changeTab);
            this.listenTo(this.state, 'change:lastMessage', this.onChat);
        },

        updateClients: function() {
            this.$('#clients').html('');
            _.forEach(this.state.get('clients'), function(client) {
                if (client === this.state.get('name')) {
                    return;
                }

                this.$('#clients').append('<li class="list-group-item">' + client + '</li>');
            }, this);
        },

        initWhiteboard: function() {
            var canvas = this.$('canvas')[0];
            paper.setup(canvas);

            var tool = new paper.Tool();
            var myPath;
	    var marker = {
		strokeColor: 'black', 
		strokeWidth: '4',
		strokeCap: 'round'
	    }
	    var originInfo = {
		radius: 18,
		box: 40,
		plusX: 75,
		plusY: 75,
	    };
	    
	    var sidebarInfo = {
		radius: originInfo.radius,
		box: originInfo.box,
		plusX:  originInfo.plusX,
		plusY:  originInfo.plusY,
		minusX: originInfo.plusX,
		minusY: originInfo.plusY + originInfo.box,
		offset: originInfo.plusX + (originInfo.box/2) +  originInfo.box,
		sca1: originInfo.plusY - (originInfo.box/2),
		sca2: originInfo.plusY + (originInfo.box/2),
		rows: 5,
		color: ["#FAFAFA", "#ADBEEF", "#345678", '#00FF00', "#00FFFF", "#FF00FF", "#FFFF00", "#555555", "#FF0000", "#0000FF"]
	    };

            tool.onMouseDown = function(event) {
                // Add a segment to the path at the position of the mouse:
		myPath = new paper.Path();
		switchMarker(myPath, marker);
		console.log(specialPoints(event.point));
		if(specialPoints(event.point) == 0)
                    myPath.add(event.point);
		else{
		    updateMarker(specialPoints(event.point), marker);
		    switchMarker(myPath, marker);
		}
	    }


            tool.onMouseDrag = function(event) {
                //Continue adding segments to path at position of mouse:
		if(specialPoints(event.point) == 0)
                    myPath.add(event.point);
            }

            tool.onMouseUp = function(event) {
                //Should stop tracking points;
                myPath.add(event.point);
            }
	    
	    function switchMarker(myPath, marker){
		myPath.strokeColor = marker.strokeColor;
		myPath.strokeWidth = marker.strokeWidth;
		myPath.strokeCap = marker.strokeCap;
	    }

	    function drawRoundedSquare(corner, size){
		var rectangle = new paper.Rectangle(corner, size);
		var cornerSize = new paper.Size(5, 5);
		return new paper.Path.Rectangle(rectangle, cornerSize);
	    }

	    function drawSidebar(sidebarInfo){
		var strokeColor = 'black';
		var strokeWidth = '1';
		var r = sidebarInfo.radius;
		var side = 2*r;
		//Draws increase.
		var incpath = drawRoundedSquare(new paper.Point(sidebarInfo.plusX - r, sidebarInfo.plusY - r) ,
						new paper.Size(side, side));
		incpath.strokeColor = strokeColor;
		var circbg = new paper.Path.Circle(new paper.Point(sidebarInfo.plusX, sidebarInfo.plusY), 5); 
		var circsm = new paper.Path.Circle(new paper.Point(sidebarInfo.minusX, sidebarInfo.minusY), 2); 
		circbg.strokeColor = strokeColor;
		circsm.strokeColor = strokeColor;
    
		//Draws decrease.
		var decpath = drawRoundedSquare(new paper.Point(sidebarInfo.minusX - r, sidebarInfo.minusY - r),
						new paper.Size(side, side));
		decpath.strokeColor = strokeColor;

		//Loops through colors and draws colors. Fills colors with colors.
		var ipath = [];
		for(var i = 0; i < (2 * sidebarInfo.rows); i++){
		    var col, row;
		    if(i < sidebarInfo.rows)
			col = sidebarInfo.sca1 - r;
		    else
			col = sidebarInfo.sca2 - r;
		    row = (i % 5) * sidebarInfo.box  + sidebarInfo.offset;
		    ipath[i] = drawRoundedSquare(new paper.Point(col, row), new paper.Size(side, side));
		    console.log(col, row, side);
		    ipath[i].fillColor = sidebarInfo.color[i];
		}
	    }
	    function specialPoints(p){
		var r = sidebarInfo.radius;
		if(p.x < sidebarInfo.sca1 - r || p.x > sidebarInfo.sca2 + r || 
		   p.y < sidebarInfo.plusX - r || p.y > sidebarInfo.rows * sidebarInfo.box + sidebarInfo.offset){
		    //console.log("safe");
		    return 0;
		}
		//returns 0 if nothing changes, 1 if markersize is increased by 1, -1 if markersize if decreased by 1, otherwise the hex value for the color.
		//100 < x < 200 and 50 < X < 250
		//200, 300. 50 space 350 to 450. 50 space. 500 to 1000.
		if( sidebarInfo.plusX - r < p.x && p.x < sidebarInfo.plusX + r &&
		    sidebarInfo.plusY - r < p.y && p.y < sidebarInfo.plusY + r){
		    return 1;
		}
		if( sidebarInfo.minusX - r < p.x && p.x < sidebarInfo.minusX + r  &&
		    sidebarInfo.minusY - r < p.y && p.y < sidebarInfo.minusY + r){
		    return -1;
		}
    
		var qx = p.x - sidebarInfo.sca1 + r;
		var dx = Math.floor(qx/sidebarInfo.box);
		var qy = p.y - sidebarInfo.offset;
		var dy = Math.floor(qy/sidebarInfo.box);
		console.log(qx, qy);
		var j = dx * 5 + dy;
		if(j >= 0)
		    return 10+j; //very hacky coding to avoid conflicts
		else 
		    return 0;
	    }
	    
	    function updateMarker(change, marker){
		if(change == 1 && marker.strokeWidth < 30){
		    marker.strokeWidth = 5;
		    //marker.strokeWidth++;
		}
		if(change == -1 && marker.strokeWidth > 1){
		    //marker.strokeWidth--;
		    marker.strokeWidth = 2;
		}
		if(10 <= change && change < 99){
		    marker.strokeColor = sidebarInfo.color[change-10];
		}
	    }

	    drawSidebar(sidebarInfo);
//            paper.view.draw();

            //this.$('canvas').attr({width: '750', height: '400'});
        },

        initVideo: function() {
            var apiKey = "40476162";
            var sessionId = "1_MX40MDQ3NjE2Mn4xMjcuMC4wLjF-RnJpIFNlcCAwNiAxOToxOToxMyBQRFQgMjAxM34wLjU0Mzk3NjF-";
            var token = "T1==cGFydG5lcl9pZD00MDQ3NjE2MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz02NDE3YTI3YjhkMDhkNmYwMDAxOTUwZGZkYmZiODNjMTM1NjliNmFjOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTURRM05qRTJNbjR4TWpjdU1DNHdMakYtUm5KcElGTmxjQ0F3TmlBeE9Ub3hPVG94TXlCUVJGUWdNakF4TTM0d0xqVTBNemszTmpGLSZjcmVhdGVfdGltZT0xMzc4NTIwMzUzJm5vbmNlPTAuMzU2ODIwNjI1MjY5ODU1NiZleHBpcmVfdGltZT0xMzc4NjA2NzUzJmNvbm5lY3Rpb25fZGF0YT0=";
            
            // Initialize session, set up event listeners, and connect
            var session = TB.initSession(sessionId);
            session.addEventListener('sessionConnected', sessionConnectedHandler.bind(this));
            session.addEventListener('streamCreated', streamCreatedHandler.bind(this));
            session.connect(apiKey, token);

            //var publisher = TB.initPublisher(apiKey, 'video', {width: 750, height: 562});

            function sessionConnectedHandler(event) {
                if (this.state.get('admin')) {
                    socket.emit('videoId', session.connection.connectionId);
                    session.publish('video');
                }
                subscribeToStreams.call(this, event.streams);
            }

            function streamCreatedHandler(event) {
                subscribeToStreams.call(this, event.streams);
            }

            function subscribeToStreams(streams) {
                _.forEach(streams, function(stream) {
                    if (stream.connection.connectionId == this.state.get('profVideo') && !this.state.get('admin')) {
                        session.subscribe(stream, 'video');
                    }
                }, this);
            }

        },

        checkPermissions: function() {
            if (!this.state.get('admin') && !this.state.get('auth') && !this.state.get('profVideo')) {
                this.$('.modal').modal();
                return false;
            }

            return true;
        },

        updateName: function() {
            this.state.set('name', this.$('.modal input[type=text]').val());
            socket.emit('joinRoom', this.state.get('id'), this.$('.modal input[type=text]').val());
        },

        // for when professor clicks a tab, send event to students
        updateTab: function(e) {
            if (this.state.get('admin')) {
                socket.emit('changeTab', $(e.target).attr('href').replace('#', ''));
            }
        },

        // for when we receive tab change from professor
        changeTab: function() {
            this.$('.nav-tabs a[href=#' + this.state.get('tab') + ']').tab('show');
        },

        chat: function(e) {
            var input = $(e.target).children('input');
            socket.emit('chat', input.val());
            this.state.set('lastMessage', '<b>' + this.state.get('name') + '</b>: ' + input.val());
            input.val('');

            return false;
        },

        onChat: function() {
            var message = this.state.get('lastMessage');
            this.$('#chats').append('<div>' + message + '</div>');
        },

        render: function() {
            this.$el.html(this.template());

            if (!this.checkPermissions()) {
                return this;
            }

            this.initVideo();
            this.initWhiteboard();
            this.updateClients();

            this.controlsView = new ControlsView({
                el: this.$('#controls'),
                state: this.state
            });

            this.$('.nav-tabs').tab();

            return this;
        }
    });
});

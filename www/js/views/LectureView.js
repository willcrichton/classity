define(function(require) {
    'use strict';

    var
    _        = require('Underscore'),
    Backbone = require('Backbone'),
    template = require('text!templates/lecture.tpl'),
    ControlsView = require('views/ControlsView');

    function repl(str, num) {
        var d = parseInt(str.match(/#slide=(\d+)/)[1]);
        return str.replace(/#slide=\d+/, '#slide=' + (Math.max(1, d+num)));
    }

    return Backbone.View.extend({
        id: 'lecture',

        events: {
            'click #name-update' : 'updateName',
            'click .nav-tabs a'  : 'updateTab',
            'click #next'        : 'nextSlide',
            'click #prev'        : 'prevSlide',
            'click #download'    : 'downloadWindow',
            'submit #chatbox'    : 'chat',
            'submit #join-form'  : 'updateName',
            'click #question-submit' : 'submitAnswer'
        },

        initialize: function(options) {
            this.template = _.template(template);
            this.state = this.options.state;
            this.listenTo(this.state, 'change:clients', this.updateClients);
            this.listenTo(this.state, 'change:clients change:questions change:answers', this.updateClients);
            this.listenTo(this.state, 'change:auth change:profVideo', this.render);
            this.listenTo(this.state, 'change:tab', this.changeTab);
            this.listenTo(this.state, 'change:lastMessage', this.onChat);
            this.listenTo(this.state, 'notification', this.notification);
            this.listenTo(this.state, 'change:SSUrl', this.changeSlide);
            this.listenTo(this.state, 'newQuestion', this.newQuestion);
        },

        updateClients: function() {
            this.$('#clients').html('');
            _.forEach(this.state.get('clients'), function(client) {
                if (client === this.state.get('name')) {
                    return;
                }

                var li = $('<li class="list-group-item">' + client + '</li>');

                _.forEach(this.state.get('questions'), function(question, index) {
                    if (question[0] == client) {
                        li.append(' <i class="glyphicon glyphicon-exclamation-sign"></i>');
                        li.addClass('question');
                        li.click((function() {
                            this.$('#student-question .modal-title').html('Question from ' + question[0]);
                            this.$('#student-question .modal-body').html(question[1]);
                            this.$('#student-question').modal();

                            var questions = this.state.get('questions');
                            questions.splice(index, 1);
                            this.state.set('questions', questions);
                            this.state.trigger('change:questions');

                            if (questions.length === 0 && this.state.get('answers').length == 0) {
                                this.$('#notification').hide();
                            }
                        }).bind(this));
                    }
                }, this);

                _.forEach(this.state.get('answers'), function(answer, index) {
                    if (answer[0] == client && !li.hasClass('question')) {
                        li.append(' <i class="glyphicon glyphicon-exclamation-sign"></i>');
                        li.addClass('question');
                        li.click((function() {
                            this.$('#student-question .modal-title').html('Answer from ' + answer[0]);
                            this.$('#student-question .modal-body').html(answer[1]);
                            this.$('#student-question').modal();

                            var answers = this.state.get('answers');
                            answers.splice(index, 1);
                            this.state.set('answers', answers);
                            this.state.trigger('change:answers');

                            if (answers.length === 0 && this.state.get('questions').length == 0) {
                                this.$('#notification').hide();
                            }
                        }).bind(this));
                    }
                }, this);


                this.$('#clients').append(li);
            }, this);
        },

        initWhiteboard: function() {
            var canvas = this.$('canvas')[0];
            paper.setup(canvas);

            var tool = new paper.Tool();
            var paths = [];
	    var numPaths = -1;
	    var marker = {
		strokeColor: 'black',
		strokeWidth: '2',
		strokeCap: 'round',
		oldWidth: '2',
		oldColor: 'black'
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
		eX: originInfo.plusX,
		eY: originInfo.plusY + 2 * originInfo.box,
		offset: originInfo.plusX + (originInfo.box/2) +  2 * originInfo.box,
		sca1: originInfo.plusY - (originInfo.box/2),
		sca2: originInfo.plusY + (originInfo.box/2),
		rows: 5,
		color: ['black', "#ADBEEF", "#345678", '#00FF00', "#00FFFF", "#FF00FF", "#FFFF00", "#555555", "#FF0000", "#0000FF"]
	    };

	    function mouseevent(event) {
		return {type: event.type,
			point: event.point
		       };
	    }
            function mousedown(point) {
		// Add a segment to the path at the position of the mouse:
		//var point = new paper.Point(event.point[1], event.point[2]);
		//console.log(point);
		numPaths++;
		paths[numPaths] = new paper.Path();

		switchMarker(paths[numPaths], marker);
		console.log(specialPoints(point));
		if(specialPoints(point) == 0)
                    paths[numPaths].add(point);
		else{
		    updateMarker(specialPoints(point), marker);
		            switchMarker(paths[numPaths], marker);
		}
		paper.view.draw();
		console.log("start...");
	    }


            function mousedrag(point) {
		//var point = new paper.Point(event.1, event.2);
                //Continue adding segments to path at position of mouse:
		if(specialPoints(point) == 0)
		    paths[numPaths].add(point);
		else{
		    if(paths[numPaths].segments.length != 0){
			numPaths++;
			paths[numPaths] = new paper.Path();
			console.log("made a path");
		    }
		}
		paper.view.draw();
		console.log("drawing...");
	    }

            function mouseup(point) {
		//var point = new paper.Point(event.1, event.2);
                //Should stop tracking points;
		if(specialPoints(point) == 0)
                {
		    paths[numPaths].add(point);
		    if(paths[numPaths].segments.length < 4)
		    {
			paths[numPaths].add(new paper.Point(point.x + 1, point.y));
		    }
		}
		paper.view.draw();
		console.log("done!...");
            }


            tool.onMouseDown = function(event) {
                // Add a segment to the path at the position of the mouse:
		mousedown(event.point);
		sendBoard(mouseevent(event));
	    }


            tool.onMouseDrag = function(event) {
                //Continue adding segments to path at position of mouse:
		mousedrag(event.point);
		sendBoard(mouseevent(event));
	    }

            tool.onMouseUp = function(event) {
		mouseup(event.point);
		sendBoard(mouseevent(event));
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
		//Draws eraser.
		//		var incpath = drawRoundedSquare(new paper.Point(;


		var incpath = drawRoundedSquare(new paper.Point(sidebarInfo.plusX - r, sidebarInfo.plusY - r) ,
						new paper.Size(side, side));
		incpath.strokeColor = strokeColor;
		var circbg = new paper.Path.Circle(new paper.Point(sidebarInfo.plusX, sidebarInfo.plusY), 5);
		var circsm = new paper.Path.Circle(new paper.Point(sidebarInfo.minusX, sidebarInfo.minusY), 2);
		circbg.strokeColor = strokeColor;
		circsm.strokeColor = strokeColor;

		//Draws small.
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
		    //console.log(col, row, side);
		    ipath[i].fillColor = sidebarInfo.color[i];
		}

		var e = drawRoundedSquare(new paper.Point(sidebarInfo.eX - r, sidebarInfo.eY - r) ,
					  new paper.Size(side, side));
		e.strokeColor = 'black';
		var e0 = new paper.Point(sidebarInfo.eX - (r/2), sidebarInfo.eY);
		var e1 = new paper.Point(sidebarInfo.eX + (r/2), sidebarInfo.eY);
		var minus = new paper.Path();
		minus.moveTo(e0);
		minus.lineTo(e1);
		minus.strokeColor = 'black';
	    }


	    function specialPoints(p){
		var r = sidebarInfo.radius;
		var rr = sidebarInfo.box / 2; //this is a slightly bigger version of r
		if(p.x < sidebarInfo.sca1 - rr || p.x > sidebarInfo.sca2 + rr ||
		   p.y < sidebarInfo.plusX - rr || p.y > sidebarInfo.rows * sidebarInfo.box + sidebarInfo.offset
		   || (p.x < sidebarInfo.plusX - rr && p.y < sidebarInfo.offset) || (p.x > sidebarInfo.plusX + rr && p.y < sidebarInfo.offset)){
		    //console.log("safe");
		    return 0;
		}
		//returns 0 if nothing changes, 1 if markersize is increased by 1, -1 if markersize if decreased by 1, otherwise the hex value for the color.
		//100 < x < 200 and 50 < X < 250
		//200, 300. 50 space 350 to 450. 50 space. 500 to 1000.
		if( sidebarInfo.plusX - rr  < p.x && p.x < sidebarInfo.plusX  + rr &&
		    sidebarInfo.plusY - rr < p.y && p.y < sidebarInfo.plusY + rr){
		    return 1;
		}
		if( sidebarInfo.minusX - rr < p.x && p.x < sidebarInfo.minusX + rr  &&
		    sidebarInfo.minusY - rr < p.y && p.y < sidebarInfo.minusY + rr){
		    return -1;
		}

		if( sidebarInfo.eX - rr < p.x && p.x < sidebarInfo.eX + rr &&
		    sidebarInfo.eY - rr < p.y && p.y < sidebarInfo.eY + rr){
		    return -2;
		}
		var qx = p.x - sidebarInfo.sca1 + rr;
		var dx = Math.floor(qx/sidebarInfo.box);
		var qy = p.y - sidebarInfo.offset;
		var dy = Math.floor(qy/sidebarInfo.box);
		if(dy < 0)
		    dy = -10;
		var j = dx * 5 + dy;
		if(j >= 0)
		    return 10+j; //very hacky coding to avoid conflicts
		else
		    return 0;
	    }

	    function updateMarker(change, marker){
		marker.strokeCap = 'round';
		if(change == 1 && marker.strokeWidth < 30){
		    marker.strokeWidth = 5;
		    marker.oldWidth = marker.strokeWidth;
		    marker.strokeColor = marker.oldColor;
		}
		if(change == -1 && marker.strokeWidth > 1){
		    marker.strokeWidth = 2;
		    marker.oldWidth = marker.strokeWidth;
		    marker.strokeColor = marker.oldColor;
		}
		if(10 <= change && change < 99){
		    marker.strokeColor = sidebarInfo.color[change-10];
		    marker.strokeWidth = marker.oldWidth;
		    marker.oldColor = marker.strokeColor;
		}
		if(change == -2){
		    marker.oldWidth = marker.strokeWidth;
		    marker.oldColor = marker.strokeColor;
		    marker.strokeCap = 'square';
		    marker.strokeWidth = '12';
		    marker.strokeColor = 'white';
		}
	    }

	    function drawBoard(event){
		console.log(event.point[1], event.point[2]);
		var pt = new paper.Point(event.point[1], event.point[2]);

		if(event.type === 'mousedown'){
		    mousedown(pt);
		}
		if(event.type === 'mouseup'){
		    mouseup(pt);
		}
		if(event.type === 'mousedrag'){
		    mousedrag(pt);
		}
		// pathsIn = JSON.parse(pathsIn);
		// pathsIn = _.map(pathsIn, function(arr) {
		//     return new paper.Path(arr[1]);
		// });
		// console.log(paths, " =? ", pathsIn);
		// paths = pathsIn;
		// numPaths = paths.length;
	    }

	    function sendBoard(event){
	    	socket.emit("boardOut", mouseevent(event));
	    }


	    if(this.state.get("admin")){
		drawSidebar(sidebarInfo);
 	    }

	    socket.on('boardIn', drawBoard);

	},

        initVideo: function() {
	        var apiKey = "40476162";
            var sessionId = "1_MX40MDQ3NjE2Mn4xMjcuMC4wLjF-U2F0IFNlcCAwNyAxOTo0MDo1NCBQRFQgMjAxM34wLjM1OTI1ODIzfg";
            var token = "T1==cGFydG5lcl9pZD00MDQ3NjE2MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1mMDA5ZDU0N2U4YWFlOTA5NmI1MDEwYjc4YTM2OTE2ODU4YmUwZDk3OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTURRM05qRTJNbjR4TWpjdU1DNHdMakYtVTJGMElGTmxjQ0F3TnlBeE9UbzBNRG8xTkNCUVJGUWdNakF4TTM0d0xqTTFPVEkxT0RJemZnJmNyZWF0ZV90aW1lPTEzNzg2MDgwNTQmbm9uY2U9MC42Njk3MjM3NDAwODM5NjI1JmV4cGlyZV90aW1lPTEzNzg2OTQ0NTQmY29ubmVjdGlvbl9kYXRhPQ==";

            // Initialize session, set up event listeners, and connect
            var session = TB.initSession(sessionId);
            session.addEventListener('sessionConnected', sessionConnectedHandler.bind(this));
            session.addEventListener('streamCreated', streamCreatedHandler.bind(this));
            session.connect(apiKey, token);

            var w = 550, h = 465;
            function sessionConnectedHandler(event) {
                if (this.state.get('admin')) {
                    socket.emit('videoId', session.connection.connectionId);
                    session.publish('video', {width: w, height: h});
                }
                subscribeToStreams.call(this, event.streams);
            }

            function streamCreatedHandler(event) {
                subscribeToStreams.call(this, event.streams);
            }

            function subscribeToStreams(streams) {
                _.forEach(streams, function(stream) {
                    if (stream.connection.connectionId == this.state.get('profVideo') && !this.state.get('admin')) {
                        session.subscribe(stream, 'video', {width: w, height: h});
                    }
                }, this);
            }

        },

        initPresentation: function() {
            if (this.state.get('SSUrl') && this.state.get('SSUrl').indexOf('undefined') === -1) {
                this.$('iframe').attr('src', this.state.get('SSUrl'));
            } else {
                $('#presentation, a[href=#presentation]').hide();
            }
        },

        checkPermissions: function() {
            if (!this.state.get('admin') && !this.state.get('auth') && !this.state.get('profVideo')) {
                if (localStorage.hasOwnProperty('info')) {
                    console.log('we have some old data: ' + localStorage.info);
                    var info = JSON.parse(localStorage.info);
                    if(info.hasOwnProperty('id')) {
                        this.state.set(info);
                        socket.emit('joinRoom', {
                          'id':info.id,
                          'username':this.state.get('name'),
                          'adminOverride':this.state.get('admin'),
                          'SSUrl':this.state.get('SSUrl')
                        });
                    }
                } else {
                    this.$('#join-lecture').modal();
                }
                return false;
            }

            return true;
        },

        updateName: function() {
            this.$('#join-lecture').modal('hide');
            this.state.set('name', this.$('.modal input[type=text]').val());
            socket.emit('joinRoom', {
                'id':this.state.get('id'),
                'username':this.$('.modal input[type=text]').val()
            });
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
            if (input.val() == '') {
                return;
            }

            socket.emit('chat', input.val());
            this.state.set('lastMessage', '<b>' + this.state.get('name') + '</b>: ' + input.val());
            input.val('');

            return false;
        },

        onChat: function() {
            var message = this.state.get('lastMessage');
            this.$('#chats').append('<div>' + message + '</div>');
            this.$('#chats').animate({scrollTop: '+=100000'}, 'fast');
        },

        notification: function() {
            this.$('#notification').show();
        },

        nextSlide: function() {
            socket.emit('advanceSlide', 1);
            var info = JSON.parse(localStorage.info);
            info.SSUrl = repl(info.SSUrl, 1);
            localStorage.info = JSON.stringify(info);
        },

        prevSlide: function() {
            socket.emit('advanceSlide', -1);
            var info = JSON.parse(localStorage.info);
            info.SSUrl = repl(info.SSUrl, -1);
            localStorage.info = JSON.stringify(info);
        },

        downloadWindow: function() {
            window.open(this.state.get("downloadLink"), '_blank');
        },

        changeSlide: function() {
            this.$('iframe').attr('src', this.state.get('SSUrl'));
        },

        newQuestion: function(question, answers) {
            this.$('#prompt').html(question);

            this.$('#answers').html('');
            _.forEach(answers, function(answer, index) {
                this.$('#answers').append('<tr><td><input type="radio" name="posedQuestion" value="' + index + '"/><td>' + answer + '</td></tr>');
            }, this);

            this.$('#posed-question').modal();
        },

        submitAnswer: function() {
            var answer = this.$('#posed-question input[type=radio]:checked');
            socket.emit('posedAnswer', answer.val());
        },

        render: function() {
            this.$el.html(this.template());

            if (!this.checkPermissions()) {
                return this;
            }

            this.initVideo();
            this.initWhiteboard();
            this.initPresentation();
            this.updateClients();

            this.controlsView = new ControlsView({
                el: this.$('#controls'),
                state: this.state
            });

            this.$('.nav-tabs').tab();

            if (this.state.get('admin')) {
                this.$('#column-right div:first-child').hide();
                this.$('#clients').addClass('tall');
            } else {
                this.$('#ssbuttonsHider').hide();
            }

            return this;
        }
    });
});

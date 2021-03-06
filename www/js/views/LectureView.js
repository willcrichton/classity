define(function(require) {
    'use strict';

    var
    _        = require('Underscore'),
    Backbone = require('Backbone'),
    template = require('text!templates/lecture.tpl'),
    ControlsView = require('views/ControlsView');

    function repl(str, num) {
        if(str === undefined) {
            return undefined;
        }
        var d = parseInt(str.match(/#slide=(\d+)/)[1]);
        return str.replace(/#slide=\d+/, '#slide=' + (Math.max(1, d+num)));
    }

    return Backbone.View.extend({
        id: 'lecture',

        events: {
            'click #name-update' : 'updateName',
            'click .arrow.right' : 'nextSlide',
            'click .arrow.left'  : 'prevSlide',
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
                if (client === this.state.get('name') || client == this.state.get('profName')) {
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
	    var boards, current;
	    if(this.state !== undefined && this.state.info !== undefined &&
	       this.state.info.whiteboardData !== undefined && this.state.info.whiteboardData.boards !== undefined
	       && this.state.info.whiteboardData.current !== undefined){
		boards = this.state.info.whiteboardData.boards;
		current = this.state.info.whiteboardData.current;
	    }
	    else{
		boards = [];
		current = 0;
	    }
	    var canvas = this.$('canvas')[0];
            paper.setup(canvas);
	    var tool = new paper.Tool();
	    var paths;
	    // if(oldPaths === undefined){
	    // 	paths = [];
	    // 	numPaths = -1;
	    // }
	    // else{
	    // 	paths = oldPaths;
	    // 	numPaths = paths.length;
	    // }
	    boards[0] = [];
	    paths = boards[0];
	    var canDraw = this.state.get("admin");
	  //  var canDraw = true
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
		newX: originInfo.plusX,
		newY: originInfo.plusY - originInfo.box,
		backX: originInfo.plusX - originInfo.box,
		backY: originInfo.plusY - originInfo.box,
		forX: originInfo.plusX + originInfo.box,
		forY: originInfo.plusY - originInfo.box,
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
		console.log(current, (boards[0]).length, "length");

		boards[current][boards[current].length] = new paper.Path();
		switchMarker(boards[current][boards[current].length - 1], marker);
		console.log(boards[current][boards[current].length-1].strokeColor);
		if(specialPoints(point) == 0)
                    boards[current][boards[current].length-1].add(point);
		else{
		    updateMarker(specialPoints(point), marker);
		    switchMarker(boards[current][boards[current].length-1], marker);
		}
		paper.view.draw();
		console.log("start...");
	    }

            function mousedrag(point) {
		        //var point = new paper.Point(event.1, event.2);
                //Continue adding segments to path at position of mouse:
		if(specialPoints(point) == 0)
		    boards[current][boards[current].length-1].add(point);
		else{
		    if(boards[current][boards[current].length-1].segments.length != 0){
			boards[current][boards[current].length] = new paper.Path();
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
		    boards[current][boards[current].length-1].add(point);
		    if(boards[current][boards[current].length-1].segments.length < 4)
		    {
			boards[current][boards[current].length-1].add(new paper.Point(point.x + 1, point.y));
		    }
		}
		paper.view.draw();
		console.log("done!...");
            }


            tool.onMouseDown = function(event) {
                // Add a segment to the path at the position of the mouse:
		if(canDraw){
		    mousedown(event.point);
		    sendBoard(mouseevent(event));
		}

	    }

            tool.onMouseDrag = function(event) {
                //Continue adding segments to path at position of mouse:
		if(canDraw){
		    mousedrag(event.point);
		    sendBoard(mouseevent(event));
		}
	    }

            tool.onMouseUp = function(event) {
		if(canDraw){
		    mouseup(event.point);
		    sendBoard(mouseevent(event));
		}
            }

	    function switchMarker(myPath, marker){
		if(myPath !== undefined){
		    myPath.strokeColor = marker.strokeColor;
		    myPath.strokeWidth = marker.strokeWidth;
		    myPath.strokeCap = marker.strokeCap;
		}
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

		//Draws the big and small sizes icons.
		var circbg = new paper.Path.Circle(new paper.Point(sidebarInfo.plusX, sidebarInfo.plusY), 5);
		var circsm = new paper.Path.Circle(new paper.Point(sidebarInfo.minusX, sidebarInfo.minusY), 2);
		var decpath = drawRoundedSquare(new paper.Point(sidebarInfo.minusX - r, sidebarInfo.minusY - r),
						new paper.Size(side, side));
		var incpath = drawRoundedSquare(new paper.Point(sidebarInfo.plusX - r, sidebarInfo.plusY - r) ,
						new paper.Size(side, side));
		incpath.strokeColor = strokeColor;
		circbg.strokeColor = strokeColor;
		circsm.strokeColor = strokeColor;
		decpath.strokeColor = strokeColor;

		//Draws eraser

		var e = drawRoundedSquare(new paper.Point(sidebarInfo.eX - r, sidebarInfo.eY - r) ,
					  new paper.Size(side, side));
		e.strokeColor = 'black';
		var e0 = new paper.Point(sidebarInfo.eX, sidebarInfo.eY - (r/3));
		var e1 = new paper.Point(sidebarInfo.eX + (r/2), sidebarInfo.eY - (r/3));
		var e2 = new paper.Point(sidebarInfo.eX, sidebarInfo.eY + (r/3));
		var e3 = new paper.Point(sidebarInfo.eX - (r/2), sidebarInfo.eY + (r/3));
		var minus = new paper.Path();
		minus.moveTo(e0);
		minus.lineTo(e1);
		minus.lineTo(e2);
		minus.lineTo(e3);
		minus.closed = true;
		minus.strokeColor = 'black';
		minus.fillColor = 'pink';

		//Draws navigation icons

		var add = drawRoundedSquare(new paper.Point(sidebarInfo.newX - r, sidebarInfo.newY - r) ,
					  new paper.Size(side, side));
		add.strokeColor = 'black';
		var plusX = new paper.Path();
		var plusY = new paper.Path();
		plusX.moveTo(new paper.Point(sidebarInfo.newX - (r/2), sidebarInfo.newY));
		plusX.lineTo(new paper.Point(sidebarInfo.newX + (r/2), sidebarInfo.newY));
		plusY.moveTo(new paper.Point(sidebarInfo.newX, sidebarInfo.newY - (r/2)));
		plusY.lineTo(new paper.Point(sidebarInfo.newX, sidebarInfo.newY + (r/2)));
		plusX.strokeColor = 'black';
		plusY.strokeColor = 'black';

		var back = drawRoundedSquare(new paper.Point(sidebarInfo.backX - r, sidebarInfo.backY - r) ,
					  new paper.Size(side, side));
		back.strokeColor = 'black';
		var le = new paper.Path();
		le.moveTo(new paper.Point(sidebarInfo.backX + (r/8), sidebarInfo.backY - (r/2)));
		le.lineTo(new paper.Point(sidebarInfo.backX - (r/2), sidebarInfo.backY));
		le.lineTo(new paper.Point(sidebarInfo.backX + (r/8), sidebarInfo.backY + (r/2)));
		le.strokeColor = 'black';
		var forw = drawRoundedSquare(new paper.Point(sidebarInfo.forX - r, sidebarInfo.forY - r) ,
					  new paper.Size(side, side));
		forw.strokeColor = 'black';
		var go = new paper.Path();
		go.moveTo(new paper.Point(sidebarInfo.forX - (r/8), sidebarInfo.forY - (r/2)));
		go.lineTo(new paper.Point(sidebarInfo.forX + (r/2), sidebarInfo.forY));
		go.lineTo(new paper.Point(sidebarInfo.forX - (r/8), sidebarInfo.forY + (r/2)));
		go.strokeColor = 'black';

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
		    ipath[i].fillColor = sidebarInfo.color[i];
		}
	    }


	    function specialPoints(p){
		var r = sidebarInfo.radius;
		var rr = sidebarInfo.box / 2; //this is a slightly bigger version of r
		if((p.x < sidebarInfo.sca1 - rr || p.x > sidebarInfo.sca2 + rr ||
		              p.y < sidebarInfo.plusX - rr || p.y > sidebarInfo.rows * sidebarInfo.box + sidebarInfo.offset
		    || (p.x < sidebarInfo.plusX - rr && p.y < sidebarInfo.offset) || (p.x > sidebarInfo.plusX + rr && p.y < sidebarInfo.offset))){
		    //console.log("safe");

		    if(p.x > sidebarInfo.plusX + 3*rr || p.x < sidebarInfo.sca1 - rr || p.y > sidebarInfo.newY + rr || p.y < sidebarInfo.newY - rr){
		    return 0;
		    }
		}
		//Different returns for different buttons. Didn't expect to have so many buttons.
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
		if( sidebarInfo.forX - rr  < p.x && p.x < sidebarInfo.forX  + rr &&
		    sidebarInfo.forY - rr < p.y && p.y < sidebarInfo.forY + rr){
		    return 3;
		}
		if( sidebarInfo.backX - rr < p.x && p.x < sidebarInfo.backX + rr  &&
		    sidebarInfo.backY - rr < p.y && p.y < sidebarInfo.backY + rr){
		    return -3;
		}

		if( sidebarInfo.newX - rr < p.x && p.x < sidebarInfo.newX + rr &&
		    sidebarInfo.newY - rr < p.y && p.y < sidebarInfo.newY + rr){
		 return 5;
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
		else if(change == -1 && marker.strokeWidth > 1){
		    marker.strokeWidth = 2;
		    marker.oldWidth = marker.strokeWidth;
		    marker.strokeColor = marker.oldColor;
		}
		else if(10 <= change && change < 99){
		    marker.strokeColor = sidebarInfo.color[change-10];
		    marker.strokeWidth = marker.oldWidth;
		    marker.oldColor = marker.strokeColor;
		}
		else if(change == -2){
		    marker.oldWidth = marker.strokeWidth;
		    marker.oldColor = marker.strokeColor;
		    marker.strokeCap = 'square';
		    marker.strokeWidth = '12';
		    marker.strokeColor = 'white';
		}
		else if(change == -3 || change == 3 || change == 5)
		    switchBoard(change);
		else
		    return 0;
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
	    }

	    function setInvisible(paths, boo){
		if(paths !== undefined){
		    for(var i = 0; i < paths.length; i++){
			paths[i].visible = boo;
		    }
		}
	    }

	    function switchBoard(select){
		console.log(current, select, "information");
		if(select === 3 && boards[current + 1] !== undefined){
		    setInvisible(boards[current], false);
		    current++;
		    setInvisible(boards[current], true);
		}
		if(select === -3 && current > 0){
		    setInvisible(boards[current], false);
		    current--;
		    setInvisible(boards[current], true);
		}
		if(select === 5){
		    if(boards[current+1] === undefined){
			setInvisible(boards[current], false);
			current++;
			boards[current] = [];
		    }
		}
		sendBoard(mouseevent(event));
	    }

	    function sendBoard(event){
	    	socket.emit("boardOut", mouseevent(event));
		socket.emit("updateBoard", {
		    "boards": boards,
		    "current": current
		});
	    }

	    if(canDraw){
		drawSidebar(sidebarInfo);
 	    }
	    socket.on('boardIn', drawBoard);
	},


 // initAllBoards: function() {
 //     var boards = [];
 //     var current = 0;

 // 	var changes = [];
 //     var loadBoard = _.bind(function(change) {
 // 	    changes.push(change);
 // 	    if(change == 3){
 // 		current++;
 // 	    }
 // 	    if(change == -3 && current > 0){
 // 		current--;
 // 	    }
 // 	    if(change == 5){
 // 		current = boards.length;
 // 	    }
 //         console.log(current, changes);
 // 	 initWhiteboard(boards[current]);

 //     }, this);
 //     var initWhiteboard = _.bind(this.initWhiteboardProto,this, loadBoard);
 // 	loadBoard(0);

 // },




        initVideo: function() {
	        var apiKey = "40476162";
var sessionId = "2_MX40MDQ3NjE2Mn4xMjcuMC4wLjF-V2VkIFNlcCAxMSAwODoyNjo1NSBQRFQgMjAxM34wLjc4OTExMjJ-";
            var token = "T1==cGFydG5lcl9pZD00MDQ3NjE2MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1iMjExNTczZjYxN2I2NjIxNWM2MzlmODIwMDZlN2JhNjZlYzE3MzkwOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9Ml9NWDQwTURRM05qRTJNbjR4TWpjdU1DNHdMakYtVjJWa0lGTmxjQ0F4TVNBd09Eb3lOam8xTlNCUVJGUWdNakF4TTM0d0xqYzRPVEV4TWpKLSZjcmVhdGVfdGltZT0xMzc4OTEzMjE1Jm5vbmNlPTAuMjcyODk5MjM0MTMxNjcxMDUmZXhwaXJlX3RpbWU9MTM3ODk5OTYxNiZjb25uZWN0aW9uX2RhdGE9";

            // Initialize session, set up event listeners, and connect
            var session = TB.initSession(sessionId);
            session.addEventListener('sessionConnected', sessionConnectedHandler.bind(this));
            session.addEventListener('streamCreated', streamCreatedHandler.bind(this));
            session.connect(apiKey, token);

            var w = 920, h = 575;
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
                $('#presentation, a[href=#presentation]').show();
            }
        },

        checkPermissions: function() {
            if (!this.state.get('admin') && !this.state.get('auth') && !this.state.get('profVideo')) {
                if (localStorage.hasOwnProperty('info')) {
                    console.log('we have some old data: ' + localStorage.info);
                    var info = JSON.parse(localStorage.info);
                    // if(info.hasOwnProperty('id') && this.state.id === info.id) { TODO
                    // if(info.hasOwnProperty('id') && (new Date()).getTime() - info.time > 60000) {
                    if(info.hasOwnProperty('id')) {
                        this.state.set(info);
                        info.adminOverride = info.admin;
                        socket.emit('joinRoom', info);
                        //socket.emit('joinRoom', {
                          //'id':info.id,
                          //'username':this.state.get('name'),
                          //'adminOverride':info.adminOverride,
                          //'SSUrl':this.state.get('SSUrl')
                        //});
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
            $('nav a[href=#' + this.state.get('tab') + ']').tab('show');
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
            if(info.SSUrl === undefined) {
                console.log('advancing slide, but no SSUrl');
            }
            info.SSUrl = repl(info.SSUrl, 1);
            localStorage.info = JSON.stringify(info);
        },

        prevSlide: function() {
            socket.emit('advanceSlide', -1);
            var info = JSON.parse(localStorage.info);
            info.SSUrl = repl(info.SSUrl, -1);
            if(info.SSUrl === undefined) {
                console.log('advancing slide, but no SSUrl');
            }
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

            $('.logo > .row > *').css('display', 'block');
            var self = this;
            $('nav a').click(function(e) {
                e.preventDefault();
                if (!$(this).hasClass('pull-right')) {
                    $('nav a').removeClass('active');
                    $(this).addClass('active');
                    $(this).tab('show');
                    self.updateTab(e);
                }
            });

            $('nav .pull-right').popover({placement: 'bottom'});
            $('nav .pull-right').attr('data-clipboard-text', document.baseURI);
            var clip = new ZeroClipboard($('nav .pull-right')[0], {
                moviePath: '/js/vendor/ZeroClipboard.swf'
            });

            var opened = false;
            clip.on('mousedown', function() {
                if (!opened) {
                    $('nav .pull-right').popover('show');
                } else {
                    $('nav .pull-right').popover('hide');
                }
                opened = !opened;
            });

            this.$('#chatbox input').attr('placeholder', this.state.get('name') + ':');

            if (this.state.get('admin')) {
                this.$('#column-right > div:first-child').hide();
                this.$('#clients').addClass('tall');
            } else {
                this.$('.arrow').hide();
            }

            return this;
        }
    });
});

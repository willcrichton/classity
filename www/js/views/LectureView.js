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

            tool.onMouseDown = function(event) {
                // Add a segment to the path at the position of the mouse:
                myPath = new paper.Path();
                myPath.strokeColor = 'black';

                myPath.add(event.point);
            }

            tool.onMouseDrag = function(event) {
                //Continue adding segments to path at position of mouse:
                myPath.add(event.point);
            }

            tool.onMouseUp = function(event) {
                //Should stop tracking points;
                myPath.add(event.point);
            }

            paper.view.draw();

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
                console.log('auth: ' + this.state.get('auth'));
                if (localStorage.hasOwnProperty('info')) {
                    console.log('we have some old data: ' + localStorage.info);
                    var info = JSON.parse(localStorage.info);
                    if(info.hasOwnProperty('id')) {
                        this.state.set(info);
                        socket.emit('joinRoom', info.id, this.state.get('name'));
                    }
                } else {
                    this.$('.modal').modal();
                }
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

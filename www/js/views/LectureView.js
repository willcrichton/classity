define(function(require) {
    'use strict';

    var 
    _        = require('Underscore'),
    Backbone = require('Backbone'),
    template = require('text!templates/lecture.tpl');

    return Backbone.View.extend({
        id: 'lecture',

        initialize: function(options) {
            this.template = _.template(template);
            this.render();
        },

        render: function() {
            this.$el.html(this.template());

            this.$('.nav-tabs a').click(function(e) {
                e.preventDefault();
                $(this).tab('show');
            });
           
            var apiKey = "40476162";
            var sessionId = "1_MX40MDQ3NjE2Mn4xMjcuMC4wLjF-RnJpIFNlcCAwNiAxOToxOToxMyBQRFQgMjAxM34wLjU0Mzk3NjF-";
            var token = "T1==cGFydG5lcl9pZD00MDQ3NjE2MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz02NDE3YTI3YjhkMDhkNmYwMDAxOTUwZGZkYmZiODNjMTM1NjliNmFjOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9MV9NWDQwTURRM05qRTJNbjR4TWpjdU1DNHdMakYtUm5KcElGTmxjQ0F3TmlBeE9Ub3hPVG94TXlCUVJGUWdNakF4TTM0d0xqVTBNemszTmpGLSZjcmVhdGVfdGltZT0xMzc4NTIwMzUzJm5vbmNlPTAuMzU2ODIwNjI1MjY5ODU1NiZleHBpcmVfdGltZT0xMzc4NjA2NzUzJmNvbm5lY3Rpb25fZGF0YT0=";
            
            // Initialize session, set up event listeners, and connect
            var session = TB.initSession(sessionId);
            session.addEventListener('sessionConnected', sessionConnectedHandler);
            session.addEventListener('streamCreated', streamCreatedHandler);
            session.connect(apiKey, token);

            var publisher = TB.initPublisher(apiKey, 'video');
            
            function sessionConnectedHandler(event) {
                subscribeToStreams(event.streams);
                session.publish(publisher);
            }

            function streamCreatedHandler(event) {
                subscribeToStreams(event.streams);
            }

            function subscribeToStreams(streams) {
                _.forEach(streams, function(stream) {
                    if (stream.connection.connectionId != session.connection.connectionId) {
                        session.subscribe(stream);
                    }
                });
            }

            return this;
        }
    });
});

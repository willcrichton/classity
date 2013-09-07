define(function(require) {
    'use strict';

    var 
    _        = require('Underscore'),
    Backbone = require('Backbone'),
    template = require('text!templates/home.tpl');

    return Backbone.View.extend({
        id: 'home',

        events: {
            'click #new'  : 'newRoom',
            'click #join' : 'join'
        },

        initialize: function(options) {
            this.template = _.template(template);
            this.state = options.state;
            this.router = options.router;
        },

        newRoom: function() {
            this.state.set('name', this.$('#name').val());
            socket.emit('newRoom', {username: this.$('#name').val()});
            console.log('creating a room');
        },

        join: function() {
            //socket.emit('joinRoom', this.$('#id').val());
            this.router.navigate(this.$('#id').val(), {trigger: true});
            console.log('joining a room');
        },

        render: function() {
            this.$el.html(this.template());

            var picker = new FilePicker({
                apiKey: 'AIzaSyBph-Hss-kNUl3SuJeXQsV7s709Dk3gseA',
                clientId: "2999561058",
                buttonEl: this.$('#pick')[0],
                onSelect: function(file) {

                    url = file.embedLink + "#slide=";
                    socket.emit("setSlideShowUrl", url);
                    //Should pass file embed link to server.
                }
            }); 

            //Specification: Proffessor will select slideshow, the frontend will send the url and the slide # to the backend
            //the backend will run the update function that makes everybody's Iframes show the correct slideshow and frame.
            //The proffessors prev and next buttons should also tell the backend to increment or decrement the backend slide 
            //variable by one, the backend will then again run the update function. 

            //All three lines should be called the first time, and then only the last line should be called on every slide update.
            //  $('#middle').append($('<iframe id = "reload"></iframe>'));
            //  $('#middle').append($('<div id = cover> </div>'));
            //  $('#reload').attr("src", url);

            return this;
        }
    });
});

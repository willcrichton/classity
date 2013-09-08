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
            socket.emit('newRoom', {username: this.$('#name').val(), presentation: this.presentation});
            console.log('creating a room');
        },

        join: function() {
            this.router.navigate(this.$('#id').val(), {trigger: true});
            console.log('joining a room');
        },

        render: function() {
            this.$el.html(this.template());

            var picker = new FilePicker({
                apiKey: 'AIzaSyBph-Hss-kNUl3SuJeXQsV7s709Dk3gseA',
                clientId: "2999561058",
                buttonEl: this.$('#pick')[0],
                onSelect: (function(file) {
                    this.$('#ppt').html(file.title + ' <i class="glyphicon glyphicon-ok"></i>');
                    this.presentation = file.embedLink;
                    this.state.set("downloadLink", file.exportLinks["application/pdf"]);
                }).bind(this)
            }); 

            //SECOND BUTTON?
            // var picker2 = new FilePicker({
            //     apiKey: 'AIzaSyBph-Hss-kNUl3SuJeXQsV7s709Dk3gseA',
            //     clientId: "2999561058",
            //     buttonEl: this.$('#pickNew')[0],
            //     onSelect: function(file) {

            //         url = file.embedLink + "#slide=";
            //         socket.emit("setSlideShowUrl", url);
            //         //Should pass file embed link to server.
            //     }
            // }); 

            return this;
        }
    });
});


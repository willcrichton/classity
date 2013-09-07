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

        initialize: function() {
            this.template = _.template(template);
        },

        newRoom: function() {
            socket.emit('newRoom');
        },

        join: function() {
            socket.emit('joinRoom', {id: this.$('input[type=text]').val()});
            console.log('joining a room');
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
});

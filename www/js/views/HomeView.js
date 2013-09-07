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
            socket.emit('newRoom', {name: this.$('#name').val()});
            console.log('creating a room');
        },

        join: function() {
            socket.emit('joinRoom', {id: this.$('#id').val()});
            console.log('joining a room');
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
});

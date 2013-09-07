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
        },

        newRoom: function() {
            this.state.set('name', this.$('#name').val());
            socket.emit('newRoom', {username: this.$('#name').val()});
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

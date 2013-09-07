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
            socket.send('new');
        },

        join: function() {
            socket.send('join', this.$('input[type=text]').val());
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
});

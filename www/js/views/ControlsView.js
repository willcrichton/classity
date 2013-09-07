define(function(require) {
    'use strict';
    
    var 
    _        = require('Underscore'),
    Backbone = require('Backbone'),
    template = require('text!templates/controls.tpl');

    return Backbone.View.extend({
        events: {
            'click #ask-question'    : 'askQuestion',
            'click #answer-question' : 'answerQuestion'
        },

        initialize: function(options) {
            this.template = _.template(template);
            this.state = options.state;
            this.render();
        },

        askQuestion: function() {
            socket.emit('askQuestion', this.$('#question-text').val());
            this.$('#question-text').val('');
        },

        answerQuestion: function() {
            socket.emit('giveAnswer', this.$('#answer-text').val());
            this.$('#answer-text').val('');
        },

        render: function() {
            this.$el.html(this.template(this.state.toJSON()));
            return this;
        }
    });
});

define(function(require) {
    'use strict';
    
    var 
    _        = require('Underscore'),
    Backbone = require('Backbone'),
    template = require('text!templates/controls.tpl');

    return Backbone.View.extend({
        events: {
            'click #ask-question'    : 'askQuestion',
            'click #answer-question' : 'answerQuestion',
            'click #pose-question'   : 'poseQuestion',
            'click #add-answer'      : 'addAnswer',
            'click .remove-answer'   : 'removeAnswer'
        },

        initialize: function(options) {
            this.template = _.template(template);
            this.state = options.state;

            this.answerTemplate = _.template('<div class="input-group" style="margin-bottom: 5px;">\
<span class="input-group-addon">\
<input type="radio" name="answersRadio" value="<%= i %>">\
</span>\
<input type="text" class="form-control" placeholder="Answer <%= i %>">\
<span class="input-group-btn">\
<button class="btn remove-answer"><i class="glyphicon glyphicon-remove"></i></button>\
</span>\
</div>');

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

        poseQuestion: function() {
            var answers = _.pluck(this.$('#answers input[type=text]'), 'value');
            socket.emit('poseQuestion', 
                        this.$('#posePrompt').val(), 
                        answers, 
                        this.$('#answers input[type=radio]:checked').val());
        },

        addAnswer: function(e) {
            if (e) {
                e.preventDefault();
            }

            this.$('#answers').append(this.answerTemplate({
                i: this.$('#answers div').length + 1
            }));
        },

        removeAnswer: function(e) {
            e.preventDefault();
            $(e.target).closest('.input-group').remove();
        },

        render: function() {
            this.$el.html(this.template(this.state.toJSON()));
            
            this.addAnswer();
            this.addAnswer();

            return this;
        }
    });
});

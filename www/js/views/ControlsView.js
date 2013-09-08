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

            this.listenTo(this.state, 'allAnswersReceived', this.answerFinish);
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
            var prompt = this.$('#posePrompt').val();
            var answer = this.$('#answers input[type=radio]:checked').val();
            this.state.set('posedAnswers', []);
            this.state.set('posedQuestion', [prompt, answers, answer]);
            socket.emit('poseQuestion', prompt, answers, answer);
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

        answerFinish: function() {
            var answers = this.state.get('posedAnswers');
            var question = this.state.get('posedQuestion');

            this.$('#results-prompt').html(question[0]);
            _.forEach(question[1], function(answer) {
                this.$('#results-answers').append('<li>' + answer + '</li>');
            }, this);

            var answerNums = _.groupBy(answers, function(answer) {
                return answer[1];
            });

            var dataset = [];
            for (var i = 0; i < question[1].length; i++) {
                dataset[i] = 0;
            }

            _.forEach(answerNums, function(arr) {
                dataset[arr[0][1]] = arr.length;
            });

            this.chart.Bar({
                labels: _.range(1, question[1].length + 1),
                datasets: [{
                    fillColor: '#2C732C',
                    strokeColor: '#399E39',
                    data: dataset
                }]
            }, {
                scaleStepWidth: 1,
                scaleStartLabel: 0,
                scaleOverride: true,
                scaleSteps: answers.length
            });

            this.$('#results-modal').modal();
        },

        render: function() {
            this.$el.html(this.template(this.state.toJSON()));
            this.chart = new Chart(this.$('#results-chart')[0].getContext('2d'));
            
            this.addAnswer();
            this.addAnswer();

            return this;
        }
    });
});

define(function(require){
    'use strict';

    requirejs.config({
        enforceDefine: true,
        inlineText: true,
        urlArgs: "bust=" + (new Date()).getTime(),

        shim: {
            'Underscore': {
                exports: '_'
            },

            'Backbone': {
                deps: ['Underscore'],
                exports: 'Backbone'
            }
        },

        paths: {
            'Underscore' : 'vendor/underscore-min',
            'Backbone'   : 'vendor/backbone-min',
        }
    });

    require(['Router', 'Backbone'], function(Router, Backbone) {
        window.socket = io.connect(document.baseURI);

        var state = new (Backbone.Model.extend({
            defaults: function() {
                return {
                    admin: false,
                    id: '',
                    clients: [],
                    auth: false,
                    profVideo: '',
                    tab: '',
                    lastMessage: '',
                    questions: [],
                    answers: [],
                    posedAnswers: []
                }
            }
        }))();

        var router = new Router({state: state});

        $(document).ready(function() {
            Backbone.history.start();
        });

        socket.on('joinedRoom', function(info) {
            console.log('joinedRoom', info);
            state.set(info);
            state.set('auth', true);
            localStorage.info = JSON.stringify(info);
            router.navigate(info.id, {trigger: true});
        });

        socket.on('clientsChanged', function(clients) {
            console.log('clientsChanged', clients);
            state.set('clients', clients);
            state.trigger('change:clients');
        });

        socket.on('clientsLeft', function(username) {
            console.log('clientsLeft', username);
            var clients = state.get('clients');
            clients.splice(clients.indexOf(username), 1);
            state.set('clients', clients);
            state.trigger('change:clients');
        });

        socket.on('profVideo', function(id) {
            console.log('profVideo', id);
            state.set('profVideo', id);
        });

        socket.on('changeTab', function(tab) {
            state.set('tab', tab);
        });

        socket.on('onChat', function(username, message) {
            state.set('lastMessage', '<b>' + username + '</b>: ' + message);
        });

        socket.on('questionAsked', function(username, question) {
            var questions = state.get('questions');
            questions.push([username, question]);
            state.set('questions', questions);
            state.trigger('change:questions');
            state.trigger('notification');
        });

        socket.on('answerGiven', function(username, answer) {
            var answers = state.get('answers');
            answers.push([username, answer]);
            state.set('answers', answers);
            state.trigger('change:answers');
            state.trigger('notification');
        });

        socket.on('updatePresentation', function(url) {
            state.set('SSUrl', url);
        });

        socket.on('questionPosed', function(question, answers) {
            state.trigger('newQuestion', question, answers);
        });

        socket.on('posedAnswer', function(username, answer) {
            var answers = state.get('posedAnswers');
            answers.push([username, answer]);
            state.set('posedAnswers', answers);
            if (answers.length == state.get('clients').length - 1) {
                state.trigger('allAnswersReceived');
            }
        });
    });
});

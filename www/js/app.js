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
                    profVideo: ''
                }
            }
        }))();

        var router = new Router({state: state});
        Backbone.history.start();

        socket.on('joinedRoom', function(info) {
            console.log('joinedRoom', info);
            state.set(info);
            state.set('auth', true);
            router.navigate(info.id, {trigger: true});
        });

        socket.on('clientsChanged', function(clients) {
            console.log('clientsChanged', clients);
            state.set('clients', clients);
            state.trigger('change:clients');
        });

        socket.on('profVideo', function(id) {
            console.log('profVideo', id);
            state.set('profVideo', id);
        });
    });
});

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
            defaults: {
                admin: false
            }
        }))();

        var r = new Router({state: state});
        Backbone.history.start();

        socket.on('joinRoom', (function(info) {
            state.set(info);
            router.navigate(info.id);
        }));
    });
});

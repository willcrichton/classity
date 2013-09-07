define(function(require){
    'use strict';

    requirejs.config({
        enforceDefine: true,
        inlineText: true,
        urlArgs: "bust=" + (new Date()).getTime(),

        shim: {
            'jQuery': {
                exports: '$'
            },

            'Underscore': {
                exports: '_'
            },

            'Backbone': {
                deps: ['Underscore', 'jQuery'],
                exports: 'Backbone'
            }
        },

        paths: {
            'jQuery'     : 'vendor/jquery-2.0.3.min',
            'Underscore' : 'vendor/underscore-min',
            'Backbone'   : 'vendor/backbone-min'
        }
    });

    require(['Router'], function(Router) {
        var r = new Router();
        Backbone.history.start();
    });
});

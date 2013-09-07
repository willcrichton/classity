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

    require(['Router'], function(Router) {
        window.socket = io.connect(document.baseURI);

        var r = new Router();
        Backbone.history.start();
    });
});

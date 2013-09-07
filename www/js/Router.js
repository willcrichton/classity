define(function(require) {
    'use strict';

    var 
    Backbone = require('Backbone'),
    $        = require('jQuery');

    return Backbone.Router.extend({
        routes: {
            ''    : 'home',
            ':id' : 'lecture'
        },

        initialize: function() {
            this.currentView = null;
        },

        swapViews: function(View, id) {
            if (this.currentView) {
                this.currentView.remove();
            }

            var view = new View(id);
            $('#content').html(view.render().el);
            this.currentView = view;

            this.trigger('changeView');
        },

        home: function() {
            this.swapViews(require('views/HomeView'));
        },
        
        lecture: function(id) {
            this.swapViews(require('views/LectureView'), id);
        }
    });
});

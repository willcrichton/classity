define(function(require) {
    'use strict';

    var Backbone = require('Backbone');

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

            var view = new View({id: id});
            $('#container').html(view.render().el);
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

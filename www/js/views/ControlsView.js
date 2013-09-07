define(function(require) {
    'use strict';
    
    var 
    _        = require('Underscore'),
    Backbone = require('Backbone'),
    template = require('text!templates/controls.tpl');

    return Backbone.View.extend({
        initialize: function(options) {
            this.template = _.template(template);
            this.state = options.state;
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this.state.toJSON()));
            return this;
        }
    });
});

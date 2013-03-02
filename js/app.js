// Models, Views, Collections, Routers
var app = {
    models: {},
    views: {},
    collections: {},
    routers: {}
};

var portfolio, // Instance of a Portfolio Collection
    results, // Instance of a Search Results Collection
    appRouter; // Instance of the Router

// Backbone Close
// Closes a view and also checks for child views that need to be closed.
Backbone.View.prototype.close = function () {
    if (this.childViews !== undefined) {
        _.each(this.childViews, function (childView) {
            if (childView.close) {
                childView.close();
            }
        });
    }
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.unbind();
    this.remove();
    return false;
};

// Define month display for Moment.js
moment.lang('en', {
    months : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

$(document).ready(function () {
    portfolio = new app.collections.Portfolio(); // Portfolio
    portfolio.fetch(); // Retrieve anything from localStorage.
    results = new app.collections.Results(); // Search Results
    appRouter = new app.routers.Router();
    Backbone.history.start();
});
// App Router
app.routers.Router = Backbone.Router.extend({
    el: $('#app'),
    routes: {
        '': 'index',
        'details/:symbol': 'stockDetailsRoute',
        'portfolio/:symbol': 'portfolioDetailsRoute',
        'transactions/:symbol': 'transactionsRoute',
        'search': 'searchRoute'
    },
    initialize: function () {},
    showView: function (view) {
        if (this.currentView) {
            app.utils.scroll.resetDuration = 0;
            this.currentView.close();
        }
        this.currentView = view;
        $(this.el).html(view.render().el);
        $(this.el).find('> div').height(($(window).height()) + 'px');
        if (view.postRender) {
            view.postRender();
        }
        return view;
    },
    index: function () {
        var that = this, promise, error;
        if (portfolio.length > 0) {
            this.showView(new app.views.Overview({ collection: portfolio }));
        } else {
            // this.showView(new app.views.Intro());
            // Adding 100 share of GOOG and 100 share of AAPL for testing.
            portfolio.create({
                symbol: 'GOOG',
                name: 'Google Inc.',
                purchases: [[100, 652.55]],
                d: moment('2012-11-14T10:120:00Z').format('MMMM Do YYYY, h:mm:ss A'),
            });
            portfolio.create({
                symbol: 'AAPL',
                name: 'Apple Inc.',
                purchases: [[100, 554.50]],
                d: moment('2012-11-12T10:120:00Z').format('MMMM Do YYYY, h:mm:ss A'),
            });
            promise = portfolio.getPromise();
            promise.done(function (data) {
                portfolio.updateCollectionAttributes(data);
                that.showView(new app.views.Overview({ collection: portfolio }));
            });
            promise.fail(function () {
                portfolio.remove(portfolio.bySymbol('GOOG'));
                portfolio.remove(portfolio.bySymbol('AAPL'));
                error = new app.views.ErrorView({ message: 'The stock service could not be reached at this time.' });
                that.showView(new app.views.Intro());
            });
        }
    },
    searchRoute: function () {
        this.showView(new app.views.Search({ collection: results }));
    },
    stockDetailsRoute: function (symbol) {
        // If the stock is already in portfolio collection load that model.
        if ((portfolio.length > 0) && (_.contains(portfolio.pluck('symbol'), symbol))) {
            this.showView(new app.views.StockDetails({model: portfolio.bySymbol(symbol)}));
        } else if ((results.length > 0) && (_.contains(results.pluck('symbol'), symbol))) {
            this.showView(new app.views.StockDetails({model: results.bySymbol(symbol)}));
        } else {
            // We could create the stock in the search results and load an actual model here.
            this.navigate('/', true);
        }
    },
    portfolioDetailsRoute: function (symbol) {
        if ((portfolio.length > 0) && (_.contains(portfolio.pluck('symbol'), symbol))) {
            this.showView(new app.views.PortfolioDetails({model: portfolio.bySymbol(symbol)}));
        } else {
            this.navigate('/', true);
        }
    },
    transactionsRoute: function (symbol) {
        if ((portfolio.length > 0) && (_.contains(portfolio.pluck('symbol'), symbol))) {
            this.showView(new app.views.Transactions({ model: portfolio.bySymbol(symbol), collection: portfolio }));
        } else if ((results.length > 0) && (_.contains(results.pluck('symbol'), symbol))) {
            this.showView(new app.views.Transactions({ model: results.bySymbol(symbol), collection: portfolio }));
        } else {
            // We could create the stock in the search results and load an actual model here.
            this.navigate('/', true);
        }
    }
});
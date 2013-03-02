// Intro
app.views.Intro = Backbone.View.extend({
    tagName: 'div',
    template: _.template(app.templates.intro),
    events: {
        'click .search': 'showSearch'
    },
    initialize: function () {},
    render: function () {
        $(this.el).html(this.template());
        return this;
    },
    showSearch: function () {
        appRouter.navigate('search', true);
        return false;
    }
});

// Overview
app.views.Overview = Backbone.View.extend({
    tagName: 'div',
    template: _.template(app.templates.overview),
    events: {
        'click .search': 'showSearch'
    },
    initialize: function () {
        this.childViews = [];
        this.collection.last().on('change:update', this.render, this);
    },
    beforeClose: function () {
        this.collection.last().off('change:update', this.render, this);
    },
    render: function () {
        var that = this, portfolioResults;
        portfolioResults = new app.views.PortfolioResults({ collection: this.collection });
        $(this.el).html(this.template(this.collection.toTemplate()));
        this.childViews.push(portfolioResults);
        $(this.el).find('.stocks').append(portfolioResults.render().el);
        // Render the pie chart. This could probably be its own view.
        _.defer(function () {
            var data = [];
            _.each(that.collection.models, function (model) {
                var p, s;
                p = model.getTotalVal() / that.collection.getTotalVal();
                s = model.get('symbol');
                data.push({ label: s,  data: p });
            });
            $.plot($('.pie'), data, {
                series: {
                    pie: {
                        show: true,
                        radius: 1,
                        label: {
                            show: true,
                            radius: 2 / 3,
                            formatter: function (label, series) {
                                return '<div class="pie-label">' + label + ' ' + Math.round(series.percent) + '%</div>';
                            },
                            threshold: 0.1
                        }
                    }
                },
                legend: {
                    show: false
                }
            });
        });
        return this;
    },
    showSearch: function () {
        appRouter.navigate('search', true);
        return false;
    },
    postRender: function () {
        // Every time a view is rendered reset the iScroll functionality.
        app.utils.scroll.init(this.collection);
    }
});

// Overview: Portfolio Results
app.views.PortfolioResults = Backbone.View.extend({
    tagName: 'ul',
    className: 'links',
    initialize: function () {
        this.childViews = [];
        this.collection.on('add', this.renderStock, this);
    },
    render: function () {
        this.collection.each(function (stock) {
            this.renderStock(stock);
        }, this);
        return this;
    },
    renderStock: function (stock) {
        var portfolioSingleStock = new app.views.PortfolioSingleStock({ model: stock });
        this.childViews.push(portfolioSingleStock);
        $(this.el).append(portfolioSingleStock.render().el);
    }
});

// Overview: Portfolio Single Stock
app.views.PortfolioSingleStock = Backbone.View.extend({
    tagName: 'li',
    className: '',
    template: _.template(app.templates.stock),
    events: {
        'click .info': 'showPortfolio'
    },
    initialize: function () {},
    render: function () {
        $(this.el).html(this.template(this.model.toTemplate()));
        return this;
    },
    showPortfolio: function () {
        appRouter.navigate('portfolio/' + this.model.get('symbol'), true);
        return false;
    }
});

// Search
app.views.Search = Backbone.View.extend({
    tagName: 'div',
    initialize: function () {
        this.childViews = [];
    },
    template: _.template(app.templates.search),
    events: {
        'click .search': 'searchStocks',
        'click .home': 'home'
    },
    render: function () {
        $(this.el).html(this.template);
        $(this.el).find('input[name=symbol]').val('').focus();
        // Create the Search Results view.
        var searchResults = new app.views.SearchResults({ collection: this.collection });
        // The created view becomes a child view of this Search view.
        this.childViews.push(searchResults);
        $(this.el).find('.stocks').append(searchResults.render().el);
        return this;
    },
    home: function () {
        appRouter.navigate('/', true);
        return false;
    },
    searchStocks: function () {
        var error, symbol, that = this, model, promise;
        symbol = $(this.el).find('input[name=symbol]').val().toUpperCase();
        if (symbol === '') {
            error = new app.views.ErrorView({ message: 'Please enter a ticker symbol.' });
        } else {
            // Check if the symbol is already in the search results.
            if (!_.contains(this.collection.pluck('symbol'), symbol)) {
                // Create a new model.
                model = new app.models.Stock({ symbol: symbol });
                // Update the model.
                promise = model.getPromise();
                // If the model update is successful then create a model in the search results with the updated attributes.
                promise.done(function (data) {
                    model.updateModelAttributes(data);
                    // Using price to determine whether or not a valid stock was returned.
                    if (model.get('price') === 0) {
                        error = new app.views.ErrorView({ message: 'The stock ticker does not exist.' });
                    } else {
                        that.collection.create(model.attributes);
                    }
                    // Destory this instance of the model.
                    model.destroy();
                });
                promise.fail(function () {
                    error = new app.views.ErrorView({ message: 'The stock service could not be reached at this time.' });
                    model.destroy();
                });
                // Clear the search box.
                $(this.el).find('input[name=symbol]').val('');
            } else {
                error = new app.views.ErrorView({ message: 'The stock ticker already exists in search results.' });
            }
        }
        return false;
    }
});

// Search: Search Results
app.views.SearchResults = Backbone.View.extend({
    tagName: 'ul',
    className: 'links',
    initialize: function () {
        this.childViews = [];
        this.collection.on('add', this.renderStock, this);
    },
    render: function () {
        // Render a Search Single Stock view for each stock in the search results.
        this.collection.each(function (stock) {
            this.renderStock(stock);
        }, this);
        return this;
    },
    renderStock: function (stock) {
        var searchSingleStock = new app.views.SearchSingleStock({ model: stock });
        this.childViews.push(searchSingleStock);
        $(this.el).append(searchSingleStock.render().el);
    }
});

// Search: Search Single Stock
app.views.SearchSingleStock = Backbone.View.extend({
    tagName: 'li',
    className: '',
    template: _.template(app.templates.stock),
    events: {
        'click .info': 'detailsStock'
    },
    initialize: function () {},
    render: function () {
        $(this.el).html(this.template(this.model.toTemplate()));
        return this;
    },
    detailsStock: function () {
        appRouter.navigate('details/' + this.model.get('symbol'), true);
        return false;
    }
});

// Portfolio Details
app.views.PortfolioDetails = Backbone.View.extend({
    tagName: 'div',
    template: _.template(app.templates.portfolioDetails),
    events: {
        'click .portfolio': 'portfolioStock',
        'click .details': 'detailsStock',
        'click .transactions': 'transactionsStock',
        'click .home': 'home',
        'click .search': 'showSearch'
    },
    initialize: function () {
        this.model.on('change:update', this.render, this);
    },
    beforeClose: function () {
        this.model.off('change:update', this.render, this);
    },
    render: function () {
        $(this.el).html(this.template(this.model.toTemplate()));
        return this;
    },
    showSearch: function () {
        appRouter.navigate('search', true);
        return false;
    },
    portfolioStock: function () {
        return false;
    },
    detailsStock: function () {
        // Navigate to the Stock Details view.
        appRouter.navigate('details/' + this.model.get('symbol'), true);
        return false;
    },
    transactionsStock: function () {
        // Navigate to the Transactions view.
        appRouter.navigate('transactions/' + this.model.get('symbol'), true);
        return false;
    },
    home: function () {
        appRouter.navigate('/', true);
        return false;
    },
    postRender: function () {
        app.utils.scroll.init(this.model);
    }
});

// Stock Details
app.views.StockDetails = Backbone.View.extend({
    tagName: 'div',
    template: _.template(app.templates.stockDetails),
    events: {
        'click .portfolio': 'portfolioStock',
        'click .details': 'detailsStock',
        'click .transactions': 'transactionsStock',
        'click .home': 'home',
        'click .search': 'showSearch'
    },
    initialize: function () {
        this.childViews = [];
        this.model.on('change:update', this.render, this);
    },
    beforeClose: function () {
        this.model.off('change:update', this.render, this);
    },
    render: function () {
        $(this.el).html(this.template(this.model.toTemplate()));
        // Render a Chart for the stock history.
        var Chart = new app.views.Chart({ model: this.model });
        this.childViews.push(Chart);
        $(this.el).find('.chart-wrapper').append(Chart.render().el);
        return this;
    },
    detailsStock: function () {
        return false;
    },
    portfolioStock: function () {
        // Navigate to the Portfolio Details view.
        appRouter.navigate('portfolio/' + this.model.get('symbol'), true);
        return false;
    },
    transactionsStock: function () {
        appRouter.navigate('transactions/' + this.model.get('symbol'), true);
        return false;
    },
    showSearch: function () {
        appRouter.navigate('search', true);
        return false;
    },
    home: function () {
        appRouter.navigate('/', true);
        return false;
    },
    postRender: function () {
        app.utils.scroll.init(this.model);
    }
});

// Stock Details: Chart
app.views.Chart = Backbone.View.extend({
    tagName: 'div',
    template: _.template(app.templates.chart),
    events: {
        'click .range': 'chart'
    },
    initialize: function () {},
    render: function () {
        $(this.el).html(this.template);
        app.utils.chart.history(this.model.get('symbol'), this.model.getBreakEven(), 30);
        return this;
    },
    chart: function (ev) {
        var range = $(ev.target).data('range');
        $(ev.target).parent().parent().find('a.button').removeClass('active');
        $(ev.target).addClass('active');
        // Send the stock data to the Chart History function.
        app.utils.chart.history(this.model.get('symbol'), this.model.getBreakEven(), range);
        return false;
    },
    close: function () {
        this.unbind();
        this.remove();
        return false;
    }
});

// Transactions
app.views.Transactions = Backbone.View.extend({
    tagName: 'div',
    template: _.template(app.templates.transactions),
    events: {
        'click .details': 'detailsStock',
        'click .portfolio': 'portfolioStock',
        'click .transactions': 'transactionsStock',
        'click .buy': 'buy',
        'click .sell': 'sell',
        'click .home': 'home',
        'click .search': 'showSearch'
    },
    initialize: function () {
        this.model.on('change:d', this.render, this);
    },
    beforeClose: function () {
        this.model.off('change:d', this.render, this);
    },
    render: function () {
        $(this.el).html(this.template(this.model.toTemplate()));
        return this;
    },
    transactionsStock: function () {
        return false;
    },
    detailsStock: function () {
        appRouter.navigate('details/' + this.model.get('symbol'), true);
        return false;
    },
    portfolioStock: function () {
        appRouter.navigate('portfolio/' + this.model.get('symbol'), true);
        return false;
    },
    showSearch: function () {
        appRouter.navigate('search', true);
        return false;
    },
    buy: function () {
        var that = this, error, adding, purchases, price, symbol, promise;
        adding = parseFloat($(this.el).find('input[name=buy]').val());
        if (adding % 1 !== 0) {
            error = new app.views.ErrorView({ message: 'The buy amount needs to be a whole number.' });
        } else {
            purchases = _.clone(this.model.get('purchases'));
            symbol = this.model.get('symbol');
            // Check if the stock has already been purchased in the past.
            if (purchases.length === 0) {
                // Update the pricing before a purchase.
                promise = this.model.getPromise();
                promise.done(function (data) {
                    that.model.updateModelAttributes(data);
                    // The stock did not previously exist in the Portfolio collection. This means that the stock model is from the Results collection.
                    // Create the stock in the Portfolio.
                    that.collection.create(that.model.attributes);
                    // Use the ask price to purchase the stock.
                    price = that.model.get('ask');
                    purchases.push([adding, price]);
                    that.collection.bySymbol(symbol).set({ purchases: purchases });
                    // Show the Transactions view again with the new data. Adding a transaction increases the screen height.
                    // A completely new view is created so iScroll can keep track of the screen height.
                    appRouter.showView(new app.views.Transactions({ model: that.collection.bySymbol(symbol) }));
                });
                promise.fail(function () {
                    error = new app.views.ErrorView({ message: 'The stock service could not be reached at this time.' });
                });
            } else {
                promise = this.model.getPromise();
                promise.done(function (data) {
                    that.model.updateModelAttributes(data);
                    price = that.model.get('ask');
                    purchases.push([adding, price]);
                    that.model.set({ purchases: purchases });
                    appRouter.showView(new app.views.Transactions({ model: that.model }));
                });
                promise.fail(function () {
                    error = new app.views.ErrorView({ message: 'The stock service could not be reached at this time.' });
                });
            }
        }
        return false;
    },
    sell: function () {
        var that = this, error, sales, shares, subtracting, price, promise;
        sales = _.clone(this.model.get('sales'));
        shares = this.model.getTotalShares();
        subtracting = parseFloat($(this.el).find('input[name=sell]').val()); // Still need to validate input.
        if (subtracting % 1 !== 0) {
            error = new app.views.ErrorView({ message: 'The sell amount needs to be a whole number.' });
        } else if (subtracting > shares) {
            error = new app.views.ErrorView({ message: 'The portfolio does not hold enough shares.' });
        } else {
            promise = this.model.getPromise();
            promise.done(function (data) {
                // Use the bid price to sell the stock.
                that.model.updateModelAttributes(data);
                price = that.model.get('bid');
                sales.push([subtracting, price]);
                that.model.set({ sales: sales });
                appRouter.showView(new app.views.Transactions({ model: that.model }));
            });
            promise.fail(function () {
                error = new app.views.ErrorView({ message: 'The stock service could not be reached at this time.' });
            });
        }
        return false;
    },
    home: function () {
        appRouter.navigate('/', true);
        return false;
    },
    postRender: function () {
        app.utils.scroll.init(this.model);
    }
});

// Error
app.views.ErrorView = Backbone.View.extend({
    el: $('#error'),
    template: _.template(app.templates.errorTemplate),
    events: {
        'click .close': 'close',
        'keypress .close': 'onKeyPress'
    },
    initialize: function () {
        this.render();
    },
    render: function () {
        $(this.el).html(this.template);
        $('.mask').fadeTo(100, 0.08);
        $('.dialog').find('p').html(this.options.message);
        $('.dialog').fadeIn(100);
        $('.close').focus();
        return this;
    },
    onKeyPress: function (event) {
        if (event.keyCode === 13) {
            $(this.el).unbind();
            $(this.el).removeData();
            $(this.el).html('');
        }
        return false;
    },
    close: function () {
        $(this.el).unbind();
        $(this.el).removeData();
        $(this.el).html('');
        return false;
    }
});
// Collection of Stocks: Portfolio
app.collections.Portfolio = Backbone.Collection.extend({
    model: app.models.Stock,
    localStorage: new Backbone.LocalStorage("Portfolio"),
    initialize: function () {},
    // Easy way to get a model by the stock symbol.
    bySymbol: function (symbol) {
        return this.filter(function (stock) {
            return stock.get('symbol') === symbol;
        })[0];
    },
    // Return the attributes as JSON.
    toTemplate: function () {
        var json = this.toJSON();
        json.totalVal = this.getTotalVal();
        json.overallProfit = this.getOverallProfit();
        json.lastUpdate = this.getLastUpdate();
        return json;
    },
    getTotalVal: function () {
        var t = 0;
        _.each(this.models, function (model) {
            t = t + model.getTotalVal();
        });
        return t;
    },
    getOverallProfit: function () {
        var t = 0;
        _.each(this.models, function (model) {
            t = t + model.getOverallProfit();
        });
        return t;
    },
    // Returns the date for the most out of date stock.
    getLastUpdate: function () {
        var t = this.first().get('d');
        _.each(this.models, function (model) {
            if (moment(model.get('d'), 'MMMM Do YYYY, h:mm:ss A').unix() < moment(t, 'MMMM Do YYYY, h:mm:ss A').unix()) {
                t = model.get('d');
            }
        });
        return t;
    },
    // Returns udpated data for the entire collection.
    getPromise: function () {
        var s = [];
        _.each(this.models, function (model) {
            s.push(model.get('symbol'));
        });
        s = s.join(',');
        return $.ajax({
            jsonpCallback: 'callback',
            url: 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from csv where url="http://download.finance.yahoo.com/d/quotes.csv?s=' + s + '&f=nsl1c1ohgd1t1pbb3ab2t8rr2eva2j1j3mw&e=.csv" and columns="name,symbol,price,change,open,high,low,d,t,prevclose,bid,bidrealtime,ask,askrealtime,targ,pe,perealtime,eps,volume,avgdailyvol,mc,mcrealtime,dayrange,weekrange"') + '&format=json&diagnostics=true',
            dataType: 'jsonp',
            timeout: 3000,
            cache: false
        });
    },
    updateCollectionAttributes: function (data) {
        var stocks = [], model, stock, i, error;
        try {
            if (!$.isArray(data.query.results.row)) { // If an array is not returned, we need to fix the response and create an array containing one object.
                stocks[0] = data.query.results.row;
            } else {
                stocks = data.query.results.row;
            }
            if (stocks.length > 0) {
                for (i = 0; i < stocks.length; i = i + 1) {
                    stock = stocks[i];
                    stock.high = parseFloat(stock.high);
                    stock.low = parseFloat(stock.low);
                    stock.open = parseFloat(stock.open);
                    stock.price = parseFloat(stock.price);
                    stock.change = parseFloat(stock.change);
                    stock.ask = ((stock.askrealtime === 'N/A') || (stock.askrealtime === '0.00')) ? stock.price : parseFloat(stock.askrealtime);
                    stock.bid = ((stock.bidrealtime === 'N/A') || (stock.bidrealtime === '0.00')) ? stock.price : parseFloat(stock.bidrealtime);
                    stock.avgdailyvol = parseFloat(stock.avgdailyvol);
                    stock.eps = parseFloat(stock.eps);
                    stock.pe = parseFloat(stock.pe);
                    stock.prevclose = parseFloat(stock.prevclose);
                    stock.targ = parseFloat(stock.targ);
                    stock.volume = parseFloat(stock.volume);
                    stock.d = moment(data.query.created).format('MMMM Do YYYY, h:mm:ss A');
                    model = this.bySymbol(stock.symbol);
                    stock.update = model.get('update') + 1;
                    model.set({
                        name: stock.name,
                        high: stock.high,
                        low: stock.low,
                        open: stock.open,
                        price: stock.price,
                        change: stock.change,
                        ask: stock.ask,
                        avgdailyvol: stock.avgdailyvol,
                        bid: stock.bid,
                        eps: stock.eps,
                        mc: stock.mc,
                        pe: stock.pe,
                        prevclose: stock.prevclose,
                        targ: stock.targ,
                        volume: stock.volume,
                        d: stock.d,
                        dayrange: stock.dayrange,
                        weekrange: stock.weekrange,
                        update: stock.update
                    });
                }
            }
        } catch (e) {
            error = new app.views.ErrorView({ message: 'An error occurred while parsing data from the stock service.' });
        }
    }
});

// Collection of Stocks: Search Results
app.collections.Results = Backbone.Collection.extend({
    model: app.models.Stock,
    bySymbol: function (symbol) {
        return this.filter(function (stock) {
            return stock.get('symbol') === symbol;
        })[0];
    },
    url: '/',
    initialize: function () {}
});
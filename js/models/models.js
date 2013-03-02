// Stock
app.models.Stock  = Backbone.Model.extend({
    defaults: {
        name: '',
        symbol: '',
        price: 0,
        change: 0,
        open: 0,
        high: 0,
        low: 0,
        purchases: [],
        sales: [],
        ask: 0,
        avgdailyvol: 0,
        bid: 0,
        dayrange: '',
        eps: 0,
        mc: '',
        pe: 0,
        prevclose: 0,
        targ: 0,
        d: '',
        volume: 0,
        weekrange: 0,
        update: 0
    },
    initialize: function () {
        this.bind('change', this.save);
        this.bind('remove', function () {
            this.destroy();
        });
    },
    url: '/',
    // Return the attributes as JSON.
    toTemplate: function () {
        var json = this.toJSON();
        json.totalVal = this.getTotalVal();
        json.totalShares = this.getTotalShares();
        json.totalPurchasesAmount = this.getTotalPurchasesAmount();
        json.totalSalesAmount = this.getTotalSalesAmount();
        json.overallInvestment = this.getOverallInvestment();
        json.overallProfit = this.getOverallProfit();
        json.breakEven = this.getBreakEven();
        json.totalPurchases = this.getTotalPurchases();
        json.totalSales = this.getTotalSales();
        return json;
    },
    // Returns the total value of the stock (price * total shares).
    getTotalVal: function () {
        return this.get('price') * this.getTotalShares();
    },
    // Loops through the purchases. Used to display the purchases on the Transactions view.
    getTotalPurchases: function () {
        var p = 0, i;
        for (i = 0; i < this.get('purchases').length; i = i + 1) {
            p = p + this.get('purchases')[i][0];
        }
        return p;
    },
    // Loops through total sales. Used to display the sales on the Transactions view.
    getTotalSales: function () {
        var s = 0, i;
        for (i = 0; i < this.get('sales').length; i = i + 1) {
            s = s + this.get('sales')[i][0];
        }
        return s;
    },
    // Returns the total number of shares owned.
    getTotalShares: function () {
        var p = 0, s = 0, i;
        for (i = 0; i < this.get('purchases').length; i = i + 1) {
            p = p + this.get('purchases')[i][0];
        }
        for (i = 0; i < this.get('sales').length; i = i + 1) {
            s = s + this.get('sales')[i][0];
        }
        return p - s;
    },
    // Returns the total dollar value for purchases.
    getTotalPurchasesAmount: function () {
        var p = 0, i;
        for (i = 0; i < this.get('purchases').length; i = i + 1) {
            p = p + (this.get('purchases')[i][0] * this.get('purchases')[i][1]);
        }
        return p;
    },
    // Returns the total dollar value for sales.
    getTotalSalesAmount: function () {
        var s = 0, i;
        for (i = 0; i < this.get('sales').length; i = i + 1) {
            s = s + (this.get('sales')[i][0] * this.get('sales')[i][1]);
        }
        return s;
    },
    // Calculates the breakeven point for the stock - the price at which the stock can be sold without a gain or loss.
    getBreakEven: function () {
        var b = this.getTotalPurchasesAmount() - this.getTotalSalesAmount();
        return b / this.getTotalShares();
    },
    // Returns any money from past sales plus the total current value of the portfolio.
    getOverallInvestment: function () {
        return this.getTotalSalesAmount() + this.getTotalVal();
    },
    // Returns any money from past sales plus the total current value of the portfolio minus any sales.
    getOverallProfit: function () {
        return (this.getTotalSalesAmount() + this.getTotalVal()) - this.getTotalPurchasesAmount();
    },
    // Returns the most current stock data.
    getPromise: function () {
        return $.ajax({
            jsonpCallback: 'callback',
            url: 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from csv where url="http://download.finance.yahoo.com/d/quotes.csv?s=' + this.get('symbol') + '&f=nsl1c1ohgd1t1pbb3ab2t8rr2eva2j1j3mw&e=.csv" and columns="name,symbol,price,change,open,high,low,d,t,prevclose,bid,bidrealtime,ask,askrealtime,targ,pe,perealtime,eps,volume,avgdailyvol,mc,mcrealtime,dayrange,weekrange"') + '&format=json&diagnostics=true',
            dataType: 'jsonp',
            timeout: 3000,
            cache: false
        });
    },
    // Updates all attributes with the data passed to the function.
    updateModelAttributes: function (data) {
        var stock;
        try {
            stock = data.query.results.row;
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
            stock.update = this.get('update') + 1;
            this.set({
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
        } catch (e) {} // Model defaults to a price of zero and won't be allowed in the search results collection.
    }
});
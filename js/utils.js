// Function used for displaying money.
Number.prototype.formatMoney = function (w, d, t) {
    var n = this, c = isNaN(w = Math.abs(w)) ? 2 : w, b = d === undefined ? "," : d, r = t === undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(w), 10).toString(), j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + r : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + r) + (w ? b + Math.abs(n - i).toFixed(w).slice(2) : "");
};

// Function to place commas in thousands.
Number.prototype.formatThousands = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove Array elements.
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

app.utils = {

    // iScroll
    scroll: {
        scroller: null,
        pullAction: function (instance) {
            if (instance instanceof Backbone.Model) {
                var that = instance;
                var promise = instance.getPromise();
                promise.done(function (data) {
                    that.updateModelAttributes(data);
                    if (app.utils.scroll.scroller) {
                        app.utils.scroll.scroller.destroy();
                        app.utils.scroll.scroller = null;
                        app.utils.scroll.init(that);
                    }
                });
                promise.fail(function() {
                    error = new app.views.ErrorView({ message: 'The stock service could not be reached at this time.' });
                    if (app.utils.scroll.scroller) {
                        app.utils.scroll.scroller.destroy();
                        app.utils.scroll.scroller = null;
                        app.utils.scroll.init(that);
                    }
                });
            } else if (instance instanceof Backbone.Collection) {
                var that = instance;
                var promise = instance.getPromise();
                promise.done(function (data) {
                    that.updateCollectionAttributes(data);
                    if (app.utils.scroll.scroller) {
                        app.utils.scroll.scroller.destroy();
                        app.utils.scroll.scroller = null;
                        app.utils.scroll.init(that);
                    }
                });
                promise.fail(function() {
                    error = new app.views.ErrorView({ message: 'The stock service could not be reached at this time.' });
                    if (app.utils.scroll.scroller) {
                        app.utils.scroll.scroller.destroy();
                        app.utils.scroll.scroller = null;
                        app.utils.scroll.init(that);
                    }
                });
            }
        },
        init: function (instance) {
            var el, offset, scroller;
            el = document.getElementById('pull');
            offset = el.offsetHeight;
            this.scroller = new iScroll('wrapper', {
                scrollbarClass: 'scrollbar',
                useTransition: true,
                topOffset: offset,
                onRefresh: function () {
                    if (el.className.match('loading')) {
                        el.className = '';
                        el.querySelector('.pull').innerHTML = 'Pull down to refresh stock values&#133;';
                    }
                },
                onScrollMove: function () {
                    var x = parseInt((this.y + 30), 10);
                    $('.bar').height(x + 'px');
                    if (this.y > 1 && !el.className.match('flip')) {
                        el.className = 'flip';
                        el.querySelector('.pull').innerHTML = 'Release to refresh stock values&#133;';
                        this.minScrollY = 0;
                    } else if (this.y <= 1 && el.className.match('flip')) {
                        el.className = '';
                        el.querySelector('.pull').innerHTML = 'Pull down to refresh stock values&#133;';
                        this.minScrollY = -offset;
                    }
                },
                onScrollEnd: function () {
                    if (el.className.match('flip')) {
                        el.className = 'loading';
                        el.querySelector('.pull').innerHTML = 'Loading&#133;';
                        app.utils.scroll.pullAction(instance);
                    }
                },
                onBeforeScrollStart: function (e) {
                    var target = e.target;
                    while (target.nodeType !== 1) {
                        target = target.parentNode;
                    }
                    if (target.tagName !== 'SELECT' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                        e.preventDefault();
                    }
                }
            });
            this.resetDuration = 400;
        }
    },
    // Charting
    chart: {

        // Stock History
        history: function (symbol, breakeven, range) {
            var past, day, month, year;
            past = new Date();
            past.setDate(past.getDate() - range);
            day = past.getDate();
            month = past.getMonth();
            year = past.getFullYear();
            $.ajax({
                dataType: 'jsonp',
                url: 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select col0, col4 from csv where url="http://ichart.finance.yahoo.com/table.csv?s=' + symbol + '&a=' + month + '&b=' + day + '&c=' + year + '&ignore=.csv" and col0 != "Date"') + '&format=json&diagnostics=true',
                cache: false,
                success: function (data) {
                    try {
                        var results = data.query.results.row.reverse(), prices = [], breakevens = [], dates = [], ticks = data.query.results.row.length, data = [], options = {}, i;
                        for (i = 0; i < ticks; i = i + 1) {
                            prices.push([i, parseFloat(results[i].col4)]);
                            breakevens.push([i, breakeven]);
                            if (i === 0) {
                                dates.push([i, moment(results[i].col0, 'YYYY-MM-DD').format('MMMM Do YYYY')]);  
                            } else if (i === (ticks - 1)) {
                                dates.push([i, moment(results[i].col0, 'YYYY-MM-DD').format('MMMM Do YYYY')]);
                            } else {
                                dates.push([i, '']);
                            }
                        }
                        data = [
                            {
                                data: prices,
                                color: '#3399ff',
                                shadowSize: 0,
                                clickable: true,
                                hoverable: true
                            },
                            {
                                data: breakevens,
                                color: '#900',
                                shadowSize: 0,
                                clickable: true,
                                hoverable: true
                            }
                        ];
                        options = {
                            legend: {
                                show: false
                            },
                            xaxis: {
                                ticks: dates,
                                tickLength: 0
                            },
                            grid: {
                                color: '#181818',
                                borderWidth: 1,
                                backgroundColor: '#fff'
                            }
                        }
                        $.plot($(".chart"), data, options);
                    } catch (e) {
                        error = new app.views.ErrorView({ message: 'An error occurred while parsing data from the stock service.' });
                    }
                },
                error: function () {
                    error = new app.views.ErrorView({ message: 'The stock service returned an error.' });
                }
            });
        }
    }
};
// http://bugs.jquery.com/ticket/8744 :(
function callback () {}
app.templates = {

    // Intro
    intro: ' \
    <div id="header" data-role="header"> \
        <header class="gradient"> \
            <h1>Stock Portfolio</h1> \
            <a href="#" class="button search"><button>Search</button></a> \
        </header> \
    </div> \
    <div id="wrapper"> \
        <div id="scroller"> \
            <div id="main" data-role="main" class="content"> \
                <section> \
                    <h2>Welcome</h2> \
                    <p>Your portfolio is empty. Please search for a stock and create a transaction.</p> \
                </section> \
            </div> \
        </div> \
    </div>',

    // Overview
    overview: ' \
    <div id="header" data-role="header"> \
        <header class="gradient"> \
            <h1>Stock Portfolio</h1> \
            <a href="#" class="button search"><button>Search</button></a> \
        </header> \
    </div> \
    <div id="wrapper"> \
        <div id="scroller"> \
            <div id="pull"> \
                <span class="icon"></span><span class="pull">Pull down to refresh&#133;</span> \
            </div> \
            <div id="main" data-role="main" class="content"> \
                <section> \
                    <h2>Portfolio Overview</h2> \
                    <div class="pie"></div> \
                </section> \
                <section> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Overall Investment +/-</span><strong class="right">$<%= overallProfit.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Portfolio Value</span><strong class="right">$<%= totalVal.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Last Updated</span><strong class="right"><%= lastUpdate %></strong> \
                    <div class="clear"></div> \
                </section> \
                <section> \
                    <div class="stocks"></div> \
                    <div class="clear"></div> \
                </section> \
            </div> \
        </div> \
    </div>',

    // Stock
    stock: ' \
    <a href="#" class="info"> \
        <strong class="left"><%= symbol %> - <%= name %></strong><span class="right">&rsaquo;</span> \
    </a>',

    // Search
    search: ' \
    <div id="header" data-role="header"> \
        <header class="gradient"> \
            <a href="#" class="button home"><button>Home</button></a> \
            <h1>Search Stocks</h1> \
        </header> \
    </div> \
    <div id="wrapper"> \
        <div id="scroller"> \
            <div id="main" data-role="main" class="content"> \
                <section> \
                    <h2>Enter a Ticker Symbol</h2> \
                    <form> \
                        <input type="text" class="symbol small left" name="symbol" value="" autocomplete="off" /> \
                        <a href="#" class="button gradient search"><button>Search</button></a> \
                        <div class="clear"></div> \
                    </form> \
                </section> \
                <section> \
                    <div class="stocks"></div> \
                </section> \
            </div> \
        </div> \
    </div>',

    // Portfolio Details
    portfolioDetails: ' \
    <div id="header" data-role="header"> \
        <header class="gradient"> \
            <a href="#" class="button home"><button>Home</button></a> \
            <h1>Portfolio: <%= symbol %></h1> \
            <a href="#" class="button search"><button>Search</button></a> \
        </header> \
    </div> \
    <div id="wrapper"> \
        <div id="scroller"> \
            <div id="pull"> \
                <span class="icon"></span><span class="pull">Pull down to refresh&#133;</span> \
            </div> \
            <div id="main" data-role="main" class="content"> \
                <section> \
                    <ul class="tabs gradient"> \
                        <li><a href="#" class="button active portfolio"><button>Portfolio</button></a></li> \
                        <li><a href="#" class="button details"><button>Stock Details</button></a></li> \
                        <li><a href="#" class="button transactions"><button>Transactions</button></a></li> \
                    </ul> \
                    <div class="clear"></div> \
                </section> \
                <div class="chart-wrapper"></div> \
                <section> \
                    <h3><%= name %></h3> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Overall Investment +/-</span><strong class="right">$<%= overallProfit.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Portfolio Value</span><strong class="right">$<%= totalVal.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Total Shares</span><strong class="right"><%= totalShares %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Current Stock Price</span><strong class="right">$<%= price.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Break-Even Stock Price</span><strong class="right"><% if (!isFinite(breakEven)) { %><span class="flag">Not Available</span><% } else { %>$<%= breakEven.formatMoney(2, ".", ",") %><% } %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Last Updated</span><strong class="right"><%= d %></strong> \
                    <div class="clear"></div> \
                </section> \
            </div> \
        </div> \
    </div>',

    // Stock Details
    stockDetails: ' \
    <div id="header" data-role="header"> \
        <header class="gradient"> \
            <a href="#" class="button home"><button>Home</button></a> \
            <h1>Stock Details: <%= symbol %></h1> \
            <a href="#" class="button search"><button>Search</button></a> \
        </header> \
    </div> \
    <div id="wrapper"> \
        <div id="scroller"> \
            <div id="pull"> \
                <span class="icon"></span><span class="pull">Pull down to refresh&#133;</span> \
            </div> \
            <div id="main" data-role="main" class="content"> \
                <section> \
                    <ul class="tabs gradient"> \
                        <% if (totalShares > 0) { %><li><a href="#" class="button portfolio"><button>Portfolio</button></a></li><% } %> \
                        <li><a href="#" class="button active details"><button>Stock Details</button></a></li> \
                        <li><a href="#" class="button transactions"><button>Transactions</button></a></li> \
                    </ul> \
                    <div class="clear"></div> \
                </section> \
                <div class="chart-wrapper"></div> \
                <section> \
                    <h3><%= name %></h3> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Price</span><strong class="right">$<%= price.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Previous Close</span><strong class="right">$<%= prevclose.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Open</span><strong class="right">$<%= open.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">High</span><strong class="right">$<%= high.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Low</span><strong class="right">$<%= low.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Change</span><strong class="right">$<%= change %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Ask</span><strong class="right"><% if (ask > 0) { %>$<%= ask.formatMoney(2, ".", ",") %><% } else { %><span class="flag">Not Available</span><% } %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Bid</span><strong class="right"><% if (bid > 0) { %>$<%= bid.formatMoney(2, ".", ",") %><% } else { %><span class="flag">Not Available</span><% } %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Average Daily Volume</span><strong class="right"><%= avgdailyvol.formatThousands() %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Day Range</span><strong class="right">$<%= dayrange %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">52-Week Range</span><strong class="right">$<%= weekrange %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">EPS</span><strong class="right"><%= eps %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">P/E</span><strong class="right"><% if (isNaN(pe)) { %><span class="flag">Not Available</span><% } else { %><%= pe %><% } %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">1 year Target Price</span><strong class="right">$<%= targ.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Volume</span><strong class="right"><%= volume.formatThousands() %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Last Updated</span><strong class="right"><%= d %></strong> \
                    <div class="clear"></div> \
                </section> \
            </div> \
        </div> \
    </div>',

    // Chart
    chart: ' \
    <section> \
        <div class="chart"></div> \
    </section> \
    <section> \
        <ul class="tabs gradient right"> \
            <li><a href="#" class="button range" data-range="360"><button>1 Yr</button></a></li> \
            <li><a href="#" class="button range" data-range="180"><button>6 Mo</button></a></li> \
            <li><a href="#" class="button range active" data-range="30"><button>30 Day</button></a></li> \
        </ul> \
        <div class="clear"></div> \
    </section>',

    // Transactions
    transactions: ' \
    <div id="header" data-role="header"> \
        <header class="gradient"> \
            <a href="#" class="button home"><button>Home</button></a> \
            <h1>Transactions: <%= symbol %></h1> \
            <a href="#" class="button search"><button>Search</button></a> \
        </header> \
    </div> \
    <div id="wrapper"> \
        <div id="scroller"> \
            <div id="pull"> \
                <span class="icon"></span><span class="pull">Pull down to refresh&#133;</span> \
            </div> \
            <div id="main" data-role="main" class="content"> \
                <section> \
                    <ul class="tabs gradient"> \
                        <% if (totalShares > 0) { %><li><a href="#" class="button portfolio"><button>Portfolio</button></a></li><% } %> \
                        <li><a href="#" class="button details"><button>Stock Details</button></a></li> \
                        <li><a href="#" class="button active transactions"><button>Transactions</button></a></li> \
                    </ul> \
                    <div class="clear"></div> \
                </section> \
                <section> \
                    <h3><%= name %></h3> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Total Shares</span><strong class="right"><%= totalShares %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Ask</span><strong class="right">$<%= ask.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Bid</span><strong class="right">$<%= bid.formatMoney(2, ".", ",") %></strong> \
                    <div class="clear"></div> \
                    <div class="hr"><hr/></div> \
                    <span class="left">Last Updated</span><strong class="right"><%= d %></strong> \
                    <div class="clear"></div> \
                </section> \
                <section> \
                    <h3>Buy<% if (totalShares > 0) { %>/Sell<% } %></h3> \
                    <form class="left"> \
                        <input type="text" class="small left" name="buy" value="" autocomplete="off" /> \
                        <a href="#" class="button buy gradient left"><button>Buy</button></a> \
                    </form> \
                    <% if (totalShares > 0) { %> \
                        <form class="right"> \
                            <input type="text" class="small left" name="sell" value="" autocomplete="off" /> \
                            <a href="#" class="button sell gradient left"><button>Sell</button></a> \
                        </form> \
                    <% } %> \
                    <div class="clear"></div> \
                </section> \
                <% if (totalPurchases > 0) { %> \
                    <section> \
                        <h4>Purchases</h4> \
                        <% _.each(purchases, function(i) { %> \
                            <div class="hr"><hr/></div> \
                            <span class="left"><%= i[0] %> Shares</span><strong class="right">$<%= i[1].formatMoney(2, ".", ",") %> / Share</strong> \
                            <div class="clear"></div> \
                        <% }); %> \
                        <div class="hr"><hr/></div> \
                        <span class="left">Total</span><strong class="right">$<%= totalPurchasesAmount.formatMoney(2, ".", ",") %></strong> \
                        <div class="clear"></div> \
                    </section> \
                <% } %> \
                <% if (totalSales > 0) { %> \
                    <section> \
                        <h4>Sales</h4> \
                        <% _.each(sales, function(i) { %> \
                            <div class="hr"><hr/></div> \
                            <span class="left"><%= i[0] %> Shares</span><strong class="right">$<%= i[1].formatMoney(2, ".", ",") %> / Share</strong> \
                            <div class="clear"></div> \
                        <% }); %> \
                        <div class="hr"><hr/></div> \
                        <span class="left">Total</span><strong class="right">$<%= totalSalesAmount.formatMoney(2, ".", ",") %></strong> \
                        <div class="clear"></div> \
                    </section> \
                <% } %> \
            </div> \
        </div> \
    </div>',

    // Error
    errorTemplate: ' \
    <div class="dialog"> \
        <p></p> \
        <form class="right"> \
            <a href="#" class="button gradient right close"><button>OK</button></a> \
        </form> \
        <div class="clear"></div> \
    </div> \
    <div class="mask"></div>'

};
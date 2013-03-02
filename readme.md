Stock Portfolio - A Mobile Web App using Backbone.js with localStorage

The app allows its user to search for stocks and make transactions (purchase and sell stock). Any stocks purchased are saved in the user's portfolio using the Backbone localStorage Adapter. As the stock market fluctuates the user can keep track of their gains and losses.

Features
- Backbone.js
- Backbone.localStorage.js
- iScroll.js - non-native scrolling and pull-to-refresh features
- Moment.js - Formats dates for charts and stock updates
- jQuery - Mainly to support the charts
- jQuery Flot - Charts to plot the stock price over time
- jQuery Flot Pie - Pie Chart for the portfolio breakdown

Issues
- There is an issue with the jQuery Flot Pie plugin display on the iPhone. The chart does not resize properly and seems to overflow outside of its boundaries.
- The stock service is not the most reliable. The responses are often missing data such as ask or bid price. A search for stock tickers that do not exist will always return a successful response, however, the price will return as 0.00.
- iScroll needs to be called for the Search view. The view does not need a pull-to-refresh feature but needs to have scrolling capabilities.

To-do
- Implement tap functionality to get rid of the click delay on a mobile device
- Possibly create a Back button instead of the default Home and Search buttons
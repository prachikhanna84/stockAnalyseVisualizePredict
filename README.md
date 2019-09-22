## Stock Data Visualization & Prediction - Project 
Background Knowledge
This project uses short term macd (12d ema) and long term macd (26d ema) to predict buy and sell signals.
The MACD's help in spotting increasing short-term momentum. 

### Technologies Used: 
- Front End: D3, Javascript , css , HTML
- Backend: Python for API
- Server : Flask 
- Database : Postgres
- DataSources: alphavantage - Realtime Stock Data , Newsapi - Display top news ,quandl/stockstats - Historical/data prediction

### Project Flow

![](/stockdataUI/images/stock%20visualization.jpg)

### Home Page

![](/stockdataUI/images/home.png)

### Visualization - Part 1

Visualization on home page is customized for 1 week, 1 Month , 6 Month Data

![](/stockdataUI/images/visual1.png)

### Visualization - Part 2

Visualization on prediction page shows exponential moving average for 12 days , exponential moving avarage for 26 days, Moving average convergence divergence , signal line.

As you can see from the chart below for AMAZON, many traders will watch for a long-term moving average (green line) to 
cross above a short-term moving average (blue line) and use this to signal drecreasing downward momentum. This 
bearish crossover suggests that the price has recently been decreasing at a faster rate than it has in the past, 
so it is a common technical sell sign. 

The basic bullish signal (buy sign) occurs when the MACD line (the solid orange line) crosses above the signal line (the ping dotted line), 
and the basic bearish signal (sell sign) is generated when the MACD crosses below the signal line.

![](/stockdataUI/images/visual2.png)

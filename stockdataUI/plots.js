var ticker=['AAPL', 'MSFT','TSLA','DELL','DIS'];
/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */

// Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input value from the form
  var stock = d3.select("#tickerInput").node.value;
  console.log(stock);


  // clear the input value
  d3.select("#tickerInput").value = "";

  // Build the plot with the new stock
  buildPlot(stock);
}

function buildPlot(stock) {
  var apiKey = "TG5XV6MAKKAIRCTT";

  var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=${apiKey}`;
  console.log(url);
  d3.json(url).then(function(data) {
    var datedstock = Object.keys(data["Time Series (Daily)"]);
    var stockValue= Object.values(data["Time Series (Daily)"])
    var openingPrices=[];
    var dates=[];
    var highPrices=[];
    var lowPrices=[];
    var closingPrices=[];
    for(oneDayValue of stockValue){
      var name = "Stock PLot";
      var stock = "AAPL";
      var startDate = '2019-09-16';
      var endDate = '2019-04-28';
       dates=datedstock;
       openingPrices.push(oneDayValue['1. open']);
       highPrices.push(oneDayValue['2. high']);
       lowPrices.push(oneDayValue['3. low']);
       closingPrices.push(oneDayValue['4. close']);
    }
    // Grab values from the response json object to build the plots

    console.log(datedstock)
    console.log(openingPrices)
    console.log(highPrices)
    console.log(lowPrices)
    console.log(closingPrices)
    
    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
        color: "#17BECF"
      }
    };

    // Candlestick Trace
    var trace2 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openingPrices,
      close: closingPrices
    };

    var data = [trace1, trace2];

    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("plot", data, layout);

  });
}

buildPlot();

// BONUS - Dynamically add the current date to the report header
var monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var today = new Date();
var date = `${monthNames[today.getMonth()]} ${today.getFullYear().toString().substr(2, 2)}`;

d3.select("#submit").on("click", handleSubmit);

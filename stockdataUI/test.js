// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%Y");

// Load data from forcepoints.csv
var apiKey = "TG5XV6MAKKAIRCTT";
  var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=${apiKey}`;
  console.log(url);
   d3.json(url).then(data => {

  // Throw an error if one occurs
  // if (error) throw error;
  console.log(data);

  // Format the date and cast the force value to a number
  var datedstock = Object.keys(data["Time Series (Daily)"]);
  var stockValue = Object.values(data["Time Series (Daily)"])
  var openingPrices = [];
  var dates = [];
  var highPrices = [];
  var lowPrices = [];
  var closingPrices = [];
  var volume = [];
  for (oneDayValue of stockValue) {
    var name = "Stock PLot";
    var stock = "AAPL";
    var startDate = '2019-09-16';
    var endDate = '2019-04-28';
    dates = datedstock;
    openingPrices.push(oneDayValue['1. open']);
    highPrices.push(oneDayValue['2. high']);
    lowPrices.push(oneDayValue['3. low']);
    closingPrices.push(oneDayValue['4. close']);
    volume.push(oneDayValue['5. volume']);
  }

  // Configure a time scale
  // d3.extent returns the an array containing the min and max values for the property specified
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(data, dates))
    .range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, closingPrices)])
    .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xTimeScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Configure a line function which will plot the x and y coordinates using our scales
  var drawLine = d3.line()
    .x(data => xTimeScale(datedstock))
    .y(data => yLinearScale(closingPrices));

  // Append an SVG path and plot its points using the line function
  chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for forceData
    .attr("d", drawLine(data))
    .classed("line", true);

  // Append an SVG group element to the chartGroup, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

  // Append an SVG group element to the chartGroup, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
});
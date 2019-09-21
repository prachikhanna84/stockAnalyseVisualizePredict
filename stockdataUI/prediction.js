const apiKey = "TG5XV6MAKKAIRCTT";
var ticker = 'AMZN';
var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${apiKey}`;

// set the dimensions and margins of the graph
const margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
const parseTime = d3.timeParse("%Y");

// set the ranges
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// define the line
const valueline = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.close); });



const bisectDate = d3.bisector(d => d.date).left;

const movingAverage = (data, numberOfPricePoints) => {
    return data.map((row, index, total) => {
        const start = Math.max(0, index - numberOfPricePoints);
        const end = index;
        const subset = total.slice(start, end + 1);
        const sum = subset.reduce((a, b) => {
            return a + b['close'];
        }, 0);
        return {
            date: row['date'],
            average: sum / subset.length
        };
    });
};
var json;
draw = (days) => {
    const data = Object.keys(json["Time Series (Daily)"]).slice(0, days).map(k => (
        {
            date: k,
            high: json["Time Series (Daily)"][k]["2. high"],
            low: json["Time Series (Daily)"][k]["3. low"],
            open: json["Time Series (Daily)"][k]["1. open"],
            close: json["Time Series (Daily)"][k]["4. close"],
            volume: json["Time Series (Daily)"][k]["5. volume"]

        }));

    d3.select("svg").remove();

    const svg = d3.select("#chart2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(d => {
        d.date = new Date(d.date),
            d.high = +d.high,
            d.low = +d.low,
            d.open = +d.open,
            d.close = +d.close,
            d.volume = +d.volume
            ;
    });

    // sort years ascending
    data.sort((a, b) => a.date - b.date);

    // Scale the range of the data
    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => d.close)]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr('id', 'priceChart')
        .attr("d", valueline);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));


}

callSTockAPI();
// Get the data
function callSTockAPI() {
    d3.json(url).then(
        j => {
            json = j;
            draw(360)
        });
}


function dayButtonClick(days) {
    draw(days)
}

function getTicker() {
    var x = document.getElementById("mySelect").value
    console.log(x);
    ticker=x;
    url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${apiKey}`;

    callSTockAPI();

}
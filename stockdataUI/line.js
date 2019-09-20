const apiKey = "TG5XV6MAKKAIRCTT";
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=${apiKey}`;

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
    .y(function (d) { return y(d.open); });
// define the line
// const valueline2 = d3.line()
//     .x(function (d) { return x(d.date); })
//     .y(function (d) { return y(d.Exports); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

draw = (json,days) => {
    const data = Object.keys(json["Time Series (Daily)"]).slice(0,days).map(k => ({
        date: k,
        open: json["Time Series (Daily)"][k]["1. open"]
    }));

    // format the data
    data.forEach(d => {
            d.date = new Date(d.date),
            d.open = +d.open;
    });

    // sort years ascending
    data.sort((a, b) => a.date - b.date);

    // Scale the range of the data
    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => d.open)]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);
    // Add the valueline path.
    // svg.append("path")
    //     .data([data])
    //     .attr("class", "line")
    //     .attr("d", valueline2);
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
}

// Get the data
d3.json(url).then(json => draw(json,30));
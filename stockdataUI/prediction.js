var ticker = 'AMZN';
var url = `http://localhost:5000/api/v1.0/getData/${ticker}`;

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
const valueline1 = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.close_12_ema); });

const valueline2 = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.close_26_ema); });

    const valueline3 = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.macd); });

    const valueline4 = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.signal); });

var json;
draw = () => {

    // Object.keys(json).map(key=>{
    //     console.log(json[key])               
    // })
    const data = Object.keys(json).map(k => (
        {
            date: json[k]['date'],
            close_12_ema: json[k]['close_12_ema'],
            close_26_ema: json[k]['close_26_ema'],
            macd: json[k]['macd'],
            signal: json[k]['signal']

        }));
    console.log(data)
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
            d.close_12_ema = +d.close_12_ema,
            d.close_26_ema = +d.close_26_ema,
            d.macd = +d.macd,
            d.signal = +d.signal
            ;
    });

    // sort years ascending
    data.sort((a, b) => a.date - b.date);

    // Scale the range of the data
    x.domain(d3.extent(data, d => d.date));
    y.domain([0, d3.max(data, d => d.close_12_ema)]);

    // Add the valueline path.
    var line1 = svg.append("path")
        .data([data])
        .attr("class", "close_12_ema")
        .attr("d", valueline1)
        ;

    var line2 = svg.append("path")
        .data([data])
        .attr("class", "close_26_ema")
        .attr("d", valueline2
        );

    var line3 = svg.append("path")
        .data([data])
        .attr("class", "macd")
        .attr("d", valueline3
        );

    var line4 = svg.append("path")
        .data([data])
        .attr("class", "signal")
        .attr("d", valueline4
        );

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    const line1Legend = svg
        .selectAll('.close_12_ema')
        .data(Object.keys(json))
        .enter()
        .append('g')
        .attr('class', 'close_12_ema');

    line1Legend
        .append('text')
        .text("close 12d ema")
        .attr('transform', 'translate(800,10)');

    const line2Legend = svg
        .selectAll('.close_26_ema')
        .data(Object.keys(json))
        .enter()
        .append('g')
        .attr('class', 'close_26_ema');

    line2Legend
        .append('text')
        .text("close 26d ema")
        .attr('transform', 'translate(800,25)');

        const line3Legend = svg
        .selectAll('.macd')
        .data(Object.keys(json))
        .enter()
        .append('g')
        .attr('class', 'macd');

    line3Legend
        .append('text')
        .text("macd")
        .attr('transform', 'translate(800,40)');

        const line4Legend = svg
        .selectAll('.signal')
        .data(Object.keys(json))
        .enter()
        .append('g')
        .attr('class', 'signal');

    line4Legend
        .append('text')
        .text("signal")
        .attr('transform', 'translate(800,55)');
}

callSTockAPI();
// Get the data
function callSTockAPI() {
    d3.json(url).then(
        j => {
            json = j;
            draw()
        });
}


function dayButtonClick() {
    draw()
}

function getTicker() {
    var x = document.getElementById("myInput").value

    ticker = x;
    url = `http://localhost:5000/api/v1.0/getData/${ticker}`;
    console.log(url);

    callSTockAPI();

}
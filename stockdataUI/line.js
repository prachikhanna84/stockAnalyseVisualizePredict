const apiKey = "TG5XV6MAKKAIRCTT";
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=${apiKey}`;

// set the dimensions and margins of the graph
const margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 700 - margin.left - margin.right,
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
// define the line
// const valueline2 = d3.line()
//     .x(function (d) { return x(d.date); })
//     .y(function (d) { return y(d.Exports); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

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

draw = (json, days) => {
    const data = Object.keys(json["Time Series (Daily)"]).slice(0, days).map(k => ({
        date: k,
        high: json["Time Series (Daily)"][k]["2. high"],
        low: json["Time Series (Daily)"][k]["3. low"],
        open: json["Time Series (Daily)"][k]["1. open"],
        close: json["Time Series (Daily)"][k]["4. close"],
        volume: json["Time Series (Daily)"][k]["5. volume"]

    }));

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
    // Add the valueline path.
    // svg.append("path")
    //     .data([data])
    //     .attr("class", "line")
    //     .attr("d", valueline2);
    // Add the X Axis
    // calculates simple moving average over 50 days
    const movingAverageData = movingAverage(data, 49);
    // generates moving average curve when called
    const movingAverageLine = d3
        .line()
        .x(d => {
            return x(d['date']);
        })
        .y(d => {
            return y(d['average']);
        })
        .curve(d3.curveBasis);
    svg
        .append('path')
        .data([movingAverageData])
        .style('fill', 'none')
        .attr('id', 'movingAverageLine')
        .attr('stroke', '#FF8900')
        .attr('d', movingAverageLine);

    /* Volume series bars */
    const volData = data.filter(d => d['volume'] !== null && d['volume'] !== 0);
    const yMinVolume = d3.min(volData, d => {
        return Math.min(d['volume']);
    });
    const yMaxVolume = d3.max(volData, d => {
        return Math.max(d['volume']);
    });
    const yVolumeScale = d3
        .scaleLinear()
        .domain([yMinVolume, yMaxVolume])
        .range([height, 0]);

    svg
        .selectAll()
        .data(volData)
        .enter()
        .append('rect')
        .attr('x', d => {
            return x(d['date']);
        })
        .attr('y', d => {
            return yVolumeScale(d['volume']);
        })
        .attr('fill', (d, i) => {
            if (i === 0) {
                return '#03a678';
            } else {
                return volData[i - 1].close > d.close ? '#c0392b' : '#03a678';
            }
        })
        .attr('width', 1)
        .attr('height', d => {
            return height - yVolumeScale(d['volume']);
        });

    const focus = svg
        .append('g')
        .attr('class', 'focus')
        .style('display', 'none');
    focus.append('circle').attr('r', 4.5);
    focus.append('line').classed('x', true);
    focus.append('line').classed('y', true);
    svg
        .append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', () => focus.style('display', null))
        .on('mouseout', () => focus.style('display', 'none'))
        .on('mousemove', generateCrosshair);
    d3.select('.overlay').style('fill', 'none');
    d3.select('.overlay').style('pointer-events', 'all');
    d3.selectAll('.focus line').style('fill', 'none');
    d3.selectAll('.focus line').style('stroke', '#67809f');
    d3.selectAll('.focus line').style('stroke-width', '1.5px');
    d3.selectAll('.focus line').style('stroke-dasharray', '3 3');

    function generateCrosshair() {
        //returns corresponding value from the domain
        const correspondingDate = x.invert(d3.mouse(this)[0]);
        //gets insertion point
        const i = bisectDate(data, correspondingDate, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const currentPoint = correspondingDate - d0['date'] > d1['date'] - correspondingDate ? d1 : d0;

        focus.attr('transform', `translate(${x(currentPoint['date'])},     ${y(currentPoint['close'])})`);
        focus
            .select('line.x')
            .attr('x1', 0)
            .attr('x2', width - x(currentPoint['date']))
            .attr('y1', 0)
            .attr('y2', 0);
        focus
            .select('line.y')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height - y(currentPoint['close']));
        updateLegends(currentPoint);
    }

    const updateLegends = currentData => {
        d3.selectAll('.lineLegend').remove();
        const legendKeys = Object.keys(data[0]);
        console.log("legendKeys",legendKeys)
        const lineLegend = svg
            .selectAll('.lineLegend')
            .data(legendKeys)
            .enter()
            .append('g')
            .attr('class', 'lineLegend')
            .attr('transform', (d, i) => {
                return `translate(0, ${i * 20})`;
            });
        lineLegend
            .append('text')
            .text(d => {
                if (d === 'date') {
                    return `${d}: ${currentData[d].toLocaleDateString()}`;
                } else if (d === 'high' || d === 'low' || d === 'open' || d === 'close') {
                    return `${d}: ${currentData[d].toFixed(2)}`;
                } else {
                    return `${d}: ${currentData[d]}`;
                }
            })
            .style('fill', 'white')
            .attr('transform', 'translate(15,9)');
    };

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));


}

// Get the data
d3.json(url).then(json => draw(json, 49));
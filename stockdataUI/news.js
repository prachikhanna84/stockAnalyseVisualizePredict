const newsApiKey = "e40340e9b11a41c2950ff50f80ff78e9";
const newsUrl = `https://newsapi.org/v2/top-headlines?category=business&q=apple&apiKey=${newsApiKey}`;

d3.json(newsUrl).then(json => news(json));


news = json => {
    d3.select("#chart1")
    .append("p")
    .text(json["articles"][0]["description"])
    .attr("align","center")

    console.log(json["articles"][0]["description"])

};
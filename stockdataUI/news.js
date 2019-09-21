const newsApiKey = "e40340e9b11a41c2950ff50f80ff78e9";
var newsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${newsApiKey}`;


populateNEWS();

function populateNEWS() {
    d3.json(newsUrl).then(json => news(json));
}

news = json => {
    var textValue= json["articles"][0]["description"] + "$$$$$$$$" + json["articles"][1]["description"]
    d3.select("#chart1")
        .append("p")
        .text(textValue)
        .attr("align", "center")

        console.log(textValue)
        
};
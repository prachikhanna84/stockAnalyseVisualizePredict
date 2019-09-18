var url = `http://localhost:5000/api/v1.0/getData/AAPL`;
console.log(url);
d3.json(url).then(function(data) {
    console.log(data);
});
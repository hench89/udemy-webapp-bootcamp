var express = require('express')
var app = express();
var request = require('request');

app.set("view engine", "ejs");

app.get('/', function(req, res){
    res.render('search');
})

app.get('/results', function(req, res){

    const query = req.query.search;
    const apiurl = 'http://www.omdbapi.com/?s=' + query + '&apikey=thewdb'

    request(apiurl, function(error, response, body) {
        if(error) {
            console.log("something went wrong!");
            console.log(error);
        } else {
            if (response.statusCode == 200) {
                var parsedJSON = JSON.parse(body);
                res.render("results", {data: parsedJSON});
            }

        }
    })

})

app.listen(3000, function(){
    console.log('server is listening on port 3000');
});
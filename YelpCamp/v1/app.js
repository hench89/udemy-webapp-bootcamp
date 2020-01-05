// setup
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// data
var campgrounds = [
    {name: 'Jylland', image: "https://ferievedgardasoeen.dk/wp-content/uploads/2013/05/Camping-ved-Gardas%C3%B8en.jpg"},
    {name: 'Fyn', image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/cb/90/dd/family-friendly-camping.jpg"},
    {name: 'Ærø', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsuaJ-UnaS9Y7Tt6s54AnZRkokswPgPUdEYQbXwkHfRAswhUsc&s"},
    {name: 'Fanø', image: "https://www.visitsamsoe.dk/wp-content/uploads/2015/04/1-strancamping.jpg"},
    {name: 'Sjælland', image: "https://www.pitchup.com/images/2/image/private/s--U7KBUpP6--/c_limit,h_2400,w_3200/e_improve,fl_progressive/q_auto/b_rgb:000,g_south_west,l_pitchup.com_wordmark_white_watermark,o_15/v1520863906/camping_lucija/313440.jpg"},
    {name: 'Jylland', image: "https://ferievedgardasoeen.dk/wp-content/uploads/2013/05/Camping-ved-Gardas%C3%B8en.jpg"},
    {name: 'Fyn', image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/cb/90/dd/family-friendly-camping.jpg"},
    {name: 'Ærø', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsuaJ-UnaS9Y7Tt6s54AnZRkokswPgPUdEYQbXwkHfRAswhUsc&s"},
    {name: 'Fanø', image: "https://www.visitsamsoe.dk/wp-content/uploads/2015/04/1-strancamping.jpg"},
    {name: 'Sjælland', image: "https://www.pitchup.com/images/2/image/private/s--U7KBUpP6--/c_limit,h_2400,w_3200/e_improve,fl_progressive/q_auto/b_rgb:000,g_south_west,l_pitchup.com_wordmark_white_watermark,o_15/v1520863906/camping_lucija/313440.jpg"},
    {name: 'Jylland', image: "https://ferievedgardasoeen.dk/wp-content/uploads/2013/05/Camping-ved-Gardas%C3%B8en.jpg"},
    {name: 'Fyn', image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/cb/90/dd/family-friendly-camping.jpg"},
    {name: 'Ærø', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsuaJ-UnaS9Y7Tt6s54AnZRkokswPgPUdEYQbXwkHfRAswhUsc&s"},
    {name: 'Fanø', image: "https://www.visitsamsoe.dk/wp-content/uploads/2015/04/1-strancamping.jpg"},
    {name: 'Sjælland', image: "https://www.pitchup.com/images/2/image/private/s--U7KBUpP6--/c_limit,h_2400,w_3200/e_improve,fl_progressive/q_auto/b_rgb:000,g_south_west,l_pitchup.com_wordmark_white_watermark,o_15/v1520863906/camping_lucija/313440.jpg"}
];

app.get('/', function(req, res){
    res.render('landing');
})

app.get('/campgrounds', function(req, res){
    res.render('campgrounds', {campgrounds: campgrounds});
})

app.post('/campgrounds', function(req, res){
    // read data from form
    var name = req.body.name;
    var image = req.body.image
    var newCampGround = {name: name, image: image};
    campgrounds.push(newCampGround);
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
})

app.get('/campgrounds/new', function(req, res){
    res.render('new');
})

app.listen(3000, function(){
    console.log('started listening on port 3000');
})
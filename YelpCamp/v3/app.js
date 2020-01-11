var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    seedDB          = require('./seeds');

// SCHEMAS
var Campground      = require('./models/campground'),
    Comment         = require('./models/comment');

// CONFIG MODULES
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// CONNECT TO DB
mongoose.connect('mongodb+srv://hench:6qUVx4U8kSe2YPVo@cluster0-d6nft.azure.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to DB!');
}).catch(err => {
    console.log('ERROR: ', err.message);
})

seedDB();




// ROUTES
app.get('/', function(req, res){
    res.render('landing');
})

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log("ERROR: ", err.message);
        } else {
            res.render('index', {campgrounds: allCampgrounds});
        }
    })

})

app.post('/campgrounds', function(req, res){
    // read data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var newCampGround = {name: name, image: image, description: desc};
    // create new campground and save to DB
    Campground.create(newCampGround, function(err, newlycreated){
        if (err) {
            console.log("ERROR: ", err.message);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    })
})

app.get('/campgrounds/new', function(req, res){
    res.render('new');
})


app.get('/campgrounds/:id', function(req, res){
    // find campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            // display campground
            res.render("show", {campground: foundCampground});
        }
    })
});


// START THE SERVER
app.listen(3000, function(){
    console.log('started listening on port 3000');
})
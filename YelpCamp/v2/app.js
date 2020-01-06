// START MODULES
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose');

// CONFIG MODULES
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// CONNECT TO DB
mongoose.connect('mongodb+srv://hench:6qUVx4U8kSe2YPVo@cluster0-d6nft.azure.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to DB!');
}).catch(err => {
    console.log('ERROR: ', err.message);
})

// SCHEMA DB SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});
var Campground = mongoose.model("Campground", campgroundSchema);


/* Campground.create({
    name: "Granite Hill",
    image: "https://media-cdn.tripadvisor.com/media/photo-s/01/ef/e5/ea/view-from-jackson-lake.jpg",
    description: "This is a huge granite hill. No bathrooms. Some water and a lot of beautiful granite."
}, function(err, newEntry){
    if (err) {
        console.log(err);
    } else {
        console.log(newEntry);
    }
}) */


// ROUTES
app.get('/', function(req, res){
    res.render('landing');
})

// get campgrounds page
app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log("ERROR: ", err.message);
        } else {
            res.render('index', {campgrounds: allCampgrounds});
        }
    })

})

// create new campground (post)
app.post('/campgrounds', function(req, res){
    // read data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
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

// get create new campground page
app.get('/campgrounds/new', function(req, res){
    res.render('new');
})

// display more information about a specific campground
app.get('/campgrounds/:id', function(req, res){
    // find campground with id
    Campground.findById(req.params.id, function(err, foundCampground){
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
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



// ========================
// LANDING PAGE ROUTE
// ========================

app.get('/', function(req, res){
    res.render('landing');
})


// ========================
// CAMPGROUNDS ROUTES
// ========================

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log("ERROR: ", err.message);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
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
    res.render('campgrounds/new');
})


app.get('/campgrounds/:id', function(req, res){
    // find campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            // display campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
});



// ========================
// COMMENT ROUTES
// ========================

app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {campground: foundCampground})
        }
    })
})

app.post('/campgrounds/:id/comments', function(req, res){
    
    // lookup campground using id
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {

            // create new comment
            Comment.create(req.body.comment, function(err, newComment){
                if (err) {
                    console.log(err);
                } else {

                    // connect new comment to campground
                    foundCampground.comments.push(newComment);
                    foundCampground.save();

                     // redirect campground show page
                    res.redirect('/campgrounds/' + foundCampground._id)
                }
            })
        }
    })

})

// START THE SERVER
app.listen(8080, function(){
    console.log('started listening on port 3000');
})
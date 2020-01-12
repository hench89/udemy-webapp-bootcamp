var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

// SHOW ALL CAMPGROUNDS
router.get('/', function(req, res){
    req.user
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    })

})

// CREATE NEW CAMPGROUND
router.post('/', function(req, res){
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

// CREATE NEW CAMPGROUND FORM
router.get('/new', function(req, res){
    res.render('/new');
})

// SHOW SPECIFIC CAMPGROUNDS
router.get('/:id', function(req, res){
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

// MIDDLEWARE
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
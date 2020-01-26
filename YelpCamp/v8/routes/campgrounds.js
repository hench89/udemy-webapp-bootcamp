const  express          = require('express');
const router            = express.Router();
const Campground        = require('../models/campground');
const middleware        = require('../middleware');

// INDEX (SHOW ALL CAMPGROUNDS)
router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    })

})

// CREATE NEW CAMPGROUND
router.post('/', middleware.isLoggedIn, function(req, res){

    // read data from form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampGround = {name: name, price: price, image: image, description: desc, author: author};

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
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
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

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            req.flash("error", "Could not find Campground");
            res.redirect("back");
        } else {
            res.render('campgrounds/edit', {campground : foundCampground});
        }
    })
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){

    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){ 
        if (err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
})


// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    
    // find and update correct campground
    Campground.findByIdAndRemove(req.params.id, req.body.campground, function(err){
        if (err) {
            res.redirect('/campgrounds')
        } else {
            req.flash("success", "Successfully deleted Campground");
            res.redirect('/campgrounds');
        }
    })
})

module.exports = router;
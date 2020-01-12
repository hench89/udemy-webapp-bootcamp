var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

// COMMENTS NEW
router.get('/new', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {campground: foundCampground})
        }
    })
})

// COMMENTS CREATE
router.post('/', isLoggedIn, function(req, res){
    
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

// MIDDLEWARE
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
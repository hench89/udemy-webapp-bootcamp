const Campground    = require('../models/campground');
const Comment       = require('../models/comment');

// all the middleware goes here
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        
        // find and campground
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                res.redirect('back');
            } else {
                // does user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.send('not logged in!')
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
    
        // find and campground
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect('back');
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.send('not logged in!')
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = middlewareObj;
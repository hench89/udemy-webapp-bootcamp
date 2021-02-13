const express   = require('express');
const router    = express.Router();
const passport  = require('passport')
const User      = require('../models/user');

// ROOT ROUTE
router.get('/', function(req, res){
    res.render('landing')
})

// SHOW REGISTER FORM
router.get('/register', function(req, res){
    res.render('register');
})

// HANDLE SIGN UP
router.post('/register', function(req, res){

    // register function stores password as a hash
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            return res.render('register')
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YeplCamp " + user.username);
                res.redirect('/campgrounds/');
            });
        }
    }); 
})

// SHOW LOGIN FORM ROUTE
router.get('/login', function(req, res){
    res.render('login')
})

// HANDLE LOGIN LOGIC
router.post('/login', passport.authenticate("local", 
        {   successRedirect: '/campgrounds', 
            failureRedirect: '/login'
        }), function(req, res){
});

// LOGOUT ROUTE
router.get('/logout', function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect('/campgrounds');
})

module.exports = router;
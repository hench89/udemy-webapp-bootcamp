var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    seedDB          = require('./seeds');

// SCHEMAS
var Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    User            = require('./models/user');

// CONFIG MODULES
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: "Party Business Cat Dog 112233",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){ // pass through current user variable on every request
    res.locals.currentUser = req.user;
    next();
});

// CONNECT TO DB
var dbname = 'yelpcamp'
mongoose.connect('mongodb+srv://hench:6qUVx4U8kSe2YPVo@cluster0-d6nft.azure.mongodb.net/' + dbname + '?retryWrites=true&w=majority', {
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
    req.user
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
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

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {campground: foundCampground})
        }
    })
})

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
    
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


// ========================
// AUTH ROUTES
// ========================

app.get('/register', function(req, res){
    res.render('register');
})

app.post('/register', function(req, res){

    // register function stores password as a hash
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render('register')
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect('/campgrounds/');
            });
        }
    }); 
})

app.get('/login', function(req, res){
    res.render('login')
})

app.post('/login', passport.authenticate("local", 
        {   successRedirect: '/campgrounds', 
            failureRedirect: '/login'
        }), function(req, res){
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campgrounds');
})


function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


// START THE SERVER
app.listen(8080, function(){
    console.log('started listening on port 8080');
})
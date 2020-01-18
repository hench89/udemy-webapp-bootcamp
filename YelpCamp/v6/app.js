// DEPENDENCIES
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    router          = express.Router({mergeParams: true}),
    seedDB          = require('./seeds');

// REQUIRING ROUTES
var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');

// SCHEMAS
var User = require('./models/user');

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

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


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
//seedDB();

// START THE SERVER
app.listen(8080, function(){
    console.log('started listening on port 8080');
})
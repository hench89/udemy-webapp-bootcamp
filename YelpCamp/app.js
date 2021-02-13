// DEPENDENCIES
const express       = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    MethodOverride  = require('method-override'),
    router          = express.Router({mergeParams: true}),
    seedDB          = require('./seeds'),
    flash           = require('connect-flash'),
    dotenv          = require('dotenv');


// REQUIRING ROUTES
var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');

// SCHEMAS
var User = require('./models/user');

// CONFIG MODULES
dotenv.config();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(MethodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// CONNECT TO DB
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to DB!');
}).catch(err => {
    console.log(err.message);
})
//seedDB();

// START THE SERVER
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Server Has Started!");
});
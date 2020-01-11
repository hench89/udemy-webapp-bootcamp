var express                     = require('express'),
    mongoose                    = require('mongoose'),
    passport                    = require('passport'),
    bodyParser                  = require('body-parser'),
    User                        = require('./models/user')
    LocalStrategy               = require('passport-local'),
    passportLocalMongoose       = require('passport-local-mongoose');

// CONFIG EXPRESS
var app = express();
app.set("view engine", "ejs");

// CONFIG EXPRESS TO USE PASSPORT
app.use(require('express-session')({
    secret: "Rusty is the cutest dog in the world!",
    resave: false,
    saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DB CONNECT
var dbname = 'auth_app'
mongoose.connect('mongodb+srv://hench:6qUVx4U8kSe2YPVo@cluster0-d6nft.azure.mongodb.net/' + dbname + '?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to DB!');
}).catch(err => {
    console.log(err);
})


// ROUTES
app.get('/', function(req, res) {
    res.render('home');
})

app.get('/secret', function(req, res) {
    res.render('secret');
})

// AUTH ROUTES
app.get('/register', function(req, res){
    res.render('register');
})

app.post('/register', function(req, res){
    res.send('REGISTER POST ROUTE');
})

// START THE SERVER
app.listen(8080, function(){
    console.log('started listening on port 8080');
})
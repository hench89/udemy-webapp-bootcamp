// START MODULES
var bodyParser      = require('body-parser'),
    express         = require('express'),
    mongoose        = require('mongoose'),
    app             = express();

// APP CONFIG
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://hench:6qUVx4U8kSe2YPVo@cluster0-d6nft.azure.mongodb.net/blogapp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to DB!');
}).catch(err => {
    console.log('ERROR: ', err.message);
});

// MONGOOSE SCHEMA CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);


/* Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1578086455600-75eba8b956ca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80",
    body: "HELLO THIS IS A BLOG POST"
}) */


// RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
})

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, db_blogs){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: db_blogs});
        }
    })
})

app.get("/blogs/new", function(req, res){
    res.render("new");
})


// START THE SERVER
app.listen(3000, function(){
    console.log('started listening on port 3000');
})
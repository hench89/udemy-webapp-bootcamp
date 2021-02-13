// START MODULES
var bodyParser      = require('body-parser'),
xprsSanitiser       = require('express-sanitizer'),
methodOverride      = require('method-override'),
express             = require('express'),
mongoose            = require('mongoose'),
app                 = express();

// APP CONFIG
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(xprsSanitiser());

mongoose.connect('', {
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


// LANDING PAGE
app.get("/", function(req, res){
    res.redirect("/blogs");
})

// BLOG ROUTE (INDEX)
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, db_blogs){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: db_blogs});
        }
    })
})

// BLOG ROUTE (NEW)
app.get("/blogs/new", function(req, res){
    res.render("new");
})

// BLOG ROUTE (CREATE)
app.post("/blogs/", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
})

// BLOG ROUTE (SHOW)
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            // SHOW
            res.render("show", {blog: foundBlog});
        }
    })
})

// BLOG ROUTE (EDIT)
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            // SHOW
            res.render("edit", {blog: foundBlog});
        }
    })
})

// BLOG ROUTE (PUT)
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        req.body.blog.body = req.sanitize(req.body.blog.body);
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

// BLOG ROUTE (DESTROY)
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})

// START THE SERVER
app.listen(3002, function(){
    console.log('started listening on port 3000');
})
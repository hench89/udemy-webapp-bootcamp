var mongoose = require("mongoose");
mongoose.connect('mongodb+srv://hench:6qUVx4U8kSe2YPVo@cluster0-d6nft.azure.mongodb.net/blogapp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to DB!');
}).catch(err => {
    console.log('ERROR: ', err.message);
});



// POST - title, content
var postSchema = new mongoose.Schema({
   title: String,
   content: String
});
var Post = mongoose.model("Post", postSchema);

// USER - email, name
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    posts: [postSchema]
});
var User = mongoose.model("User", userSchema);

 var newUser = new User({
     email: "hermione@hogwarts.edu",
     name: "Hermione Granger"
 });

/*  newUser.posts.push({
     title: "How to bre polyjuice potion",
     content: "Just kidding.  Go to potions class to learn it!"
 });

 newUser.save(function(err, user){
   if(err){
       console.log(err);
   } else {
       console.log(user);
   }
 });

 var newPost = new Post({
     title: "Reflections on Apples",
     content: "They are delicious"
 });

 newPost.save(function(err, post){
     if(err){
         console.log(err);
     } else {
         console.log(post);
     }
 }); */


User.findOne({name: "Hermione Granger"}, function(err, user){
    if(err){
        // console.log(err);
    } else {
        user.posts.push({
            title: "3 Things I really hate",
            content: "Voldemort.  Voldemort. Voldemort"
        });
        user.save(function(err, user){
            if(err){
                console.log(err);
            } else {
                console.log(user);
            }
        });
    }
});
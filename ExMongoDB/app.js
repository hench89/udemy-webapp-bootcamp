var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://....', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('connected to DB!');
}).catch(err => {
    console.log('ERROR: ', err.message);
})

// set up schema and model a collection
var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});
var Cat = mongoose.model("Cat", catSchema);

// add a cat to the database
function saveCat() {
    var newCat = new Cat ({
        name: "Ms. Norris",
        age: 7,
        temperament: "Evil"
    })
    newCat.save(function(err, cat){
        if (err) {
            console.log("Something went wrong!");
        } else {
            console.log("We just saved a cat to the DB!");
            console.log(cat);
        }
    });
}

//retrieve all cats from the database
function findCats() {
    Cat.find({}, function(err, cats){
        if (err) {
            console.log("ERROR: ", err.message);
        } else {
            console.log("ALL THE CATS.........");
            console.log(cats);
        }
    })
}

// create and save a cat at the same time
function createCat(){
    Cat.create({
        name: "Snow white",
        age: 15,
        temperament: "Bland"
    }, function(err, cat){
        if (err) {
            console.log("ERROR: ", err.message);
        } else {
        console.log(cat);
        }
    })
}

findCats();

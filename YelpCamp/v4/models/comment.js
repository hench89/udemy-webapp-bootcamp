const mongoose = require("mongoose");
 
const commentSchema = new mongoose.Schema({
	"author": { type: String, default: "Anonymous" },
	"text": String,
	"email": { type: String, default: "email@isnotprovided.com" }
});
 
module.exports = mongoose.model("Comment", commentSchema);


var mongoose = require("mongoose");

//------------------------------------------------------------------ DATA
// schema setup for mongo db
console.log("-----Running:\tcampground.js");
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
// embed schema into a model
var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
// module.exports = mongoose.model("Campground", campgroundSchema);
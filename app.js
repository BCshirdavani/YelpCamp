
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));



//------------------------------------------------------------------ DATA
// schema setup for mongo db
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});
// embed schema into a model
var Campground = mongoose.model("Campground", campgroundSchema);
// add the existing campgrounds
// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"
//     }, function(err, campground){
//         if(err){
//             console.log("error: ", err);
//         }else{
//             console.log("newly created campground");
//             console.log(campground);
//         }
//     });


//------------------------------------------------------------------ ROUTES 
// landing page
app.get("/", function(req, res){
    // res.send("this will be the landing page soon...");
    res.render("landing.ejs");
});

// camp grounds route
app.get("/campgrounds", function(req, res){
    // get all campgrounds from mongo db
    Campground.find({}, function(error, allCampgrounds){
        if(error){
            console.log("error:");
            console.log(error);
        }else{
            // render the file
            console.log("found camp grounds");
            res.render("campgrounds", {campgrounds:allCampgrounds});
        }
    });
});

// add campground route
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    // create a new campbround, and save to mongo database
    Campground.create(newCampground, function(error, newlyCreated){
        if(error){
            console.log("error:", error)
        }else{
            // redirect back to /campgrounds page
            res.redirect("/campgrounds");
        }
    });
    // redirect back to /campgrounds page
    // res.redirect("/campgrounds");
});
// add form for new campground route
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
})


//------------------------------------------------------------------ PORT
// running on cloud 9 server..change port number for different server as needed
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});
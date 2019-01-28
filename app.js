
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
// var User = require("./models/user.js");
var seedDB = require("./seeds.js");


mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", { useNewUrlParser: true });
seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));



//--------------------------------------------------------------------------
//------------------------------------------------------------------ ROUTES 
// landing page
app.get("/", function(req, res){
    // res.send("this will be the landing page soon...");
    res.render("landing.ejs");
});

//-------------------------------  INDEX route - show all campgrounds
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
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
});

//------------------------------- CREATE route
// add campground route
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // create a new campgraound, and save to mongo database
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

//------------------------------- NEW route - show form
// add form for new campground route
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
})

//------------------------------- SHOW route - shows more info about one thing
app.get("/campgrounds/:id", function(req, res){
   Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampGround){
       if(error){
           console.log("error: ", error);
       } else {
           console.log("found:\n", foundCampGround);
           res.render("show", {campground: foundCampGround});
       }
   });
})


//------------------------------------------------------------------ PORT
// running on cloud 9 server..change port number for different server as needed
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});
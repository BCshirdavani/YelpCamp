

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");



//-------------------------------  INDEX route - show all campgrounds
// camp grounds route
router.get("/", function(req, res){
    console.log("req.user: ", req.user);
    // get all campgrounds from mongo db
    Campground.find({}, function(error, allCampgrounds){
        if(error){
            console.log("error:");
            console.log(error);
        }else{
            // render the file
            console.log("found camp grounds");
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

//------------------------------- CREATE route
// add campground route
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
    res.render("campgrounds/new.ejs");
})

//------------------------------- SHOW route - shows more info about one thing
router.get("/:id", function(req, res){
   Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampGround){
       if(error){
           console.log("error: ", error);
       } else {
           console.log("found:\n", foundCampGround);
           res.render("campgrounds/show", {campground: foundCampGround});
       }
   });
});

//------------------------------- is logged in middle ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }  
    res.redirect("/login");
};

module.exports = router;


var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");  // index.js is a special name, optional to explicitly spell it out...



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
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author};
    console.log("~~~ req.user: ", req.user);
    // create a new campgraound, and save to mongo database
    Campground.create(newCampground, function(error, newlyCreated){
        if(error){
            console.log("error:", error)
        }else{
            // redirect back to /campgrounds page
            console.log("~~~ new campground: ", newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//------------------------------- NEW route - show form
// add form for new campground route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
})

//------------------------------- SHOW route - shows more info about one thing
// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "campground not found...");
            res.redirect("back");
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//------------------------------- EDIT route 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        // if(error){
        //     req.flash("error", "Campground not found");
        // }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});



//------------------------------- UDPATE route 
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update correct campground, then redirect to show
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground){
        if (error){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//------------------------------- DESTROY route 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(error){
        if(error){
            console.log("error: ", error);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;
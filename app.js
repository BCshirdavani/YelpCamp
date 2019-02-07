
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require('passport');
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
// var User = require("./models/user.js");
var seedDB = require("./seeds.js");




mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", { useNewUrlParser: true });
seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));         // include css style directory


//-------------------------------  passport configuration
app.use(require("express-session")({
    secret: "ducks fart",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//--------------------------------------------------------------------------
//------------------------------------------------------------------ ROUTES 
//  INDEX               /campgrounds                    GET
//  NEW                 /campgrounds/new                GET
//  CREATE              /campgrounds                    POST
//  SHOW                /campgrounds/:id                GET
//  NEW comment         /campgrounds/:id/comments/new   GET    
//  CREATE comment      /campgrounds/:id/comments       POST

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
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
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
    res.render("campgrounds/new.ejs");
})

//------------------------------- SHOW route - shows more info about one thing
app.get("/campgrounds/:id", function(req, res){
   Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampGround){
       if(error){
           console.log("error: ", error);
       } else {
           console.log("found:\n", foundCampGround);
           res.render("campgrounds/show", {campground: foundCampGround});
       }
   });
})

//  Comments Routes
//------------------------------- NEW comment - middleware blocks if not logged in
 app.get("/campgrounds/:id/comments/new",isLoggedIn ,function(req, res){
     // find campground by id
     Campground.findById(req.params.id, function(error, campground){
         if(error){
             console.log("error: ", error)
         }else{
             res.render("comments/new.ejs", {campground: campground});
         }
     });
 });
 
//------------------------------- CREATE comment
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
   // lookup campground using id
   Campground.findById(req.params.id, function(error, campground){
       if(error){
           console.log(error);
           res.redirect("/campgrounds");
       }else{
           // create new comment
          Comment.create(req.body.comment, function(error, comment){
              if(error){
                  console.log(error);
              }else{
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect("/campgrounds/" + campground._id);
              }
          });
       }
   });
});

//=============================================
// AUTH ROUTES
//=============================================
//------------------------------- show register form
app.get("/register", function(req, res){
    res.render("register");
});
//------------------------------- Sign Up Logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(error, user){
        if(error){
            console.log(error);
            res.render("register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");  
            });
        }
    });
});

//------------------------------- Show login form
app.get("/login", function(req, res) {
    res.render("login");
});
//------------------------------- Handle login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
        
    }), function(req, res) {
    console.log("authenticate method middle ware called from POST login route");
});


//------------------------------- Logout Route
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});


//------------------------------- is logged in middle ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }  
    res.redirect("/login");
};




//------------------------------------------------------------------ PORT
// running on cloud 9 server..change port number for different server as needed
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});
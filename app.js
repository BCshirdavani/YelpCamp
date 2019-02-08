
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


// requiring routes
var commentRoutes       = require("./routes/comments");
var campgroundRoutes    = require("./routes/campgrounds");
var indexRoutes         = require("./routes/index");




mongoose.connect("mongodb://localhost:27017/yelp_camp_v9", { useNewUrlParser: true });
// seedDB();    // seed the database
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

// make middle ware to run on every single route, so they can all handle the logged in user data
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);  // append campgrounds to front of these routes





//------------------------------------------------------------------ PORT
// running on cloud 9 server..change port number for different server as needed
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started!");
});
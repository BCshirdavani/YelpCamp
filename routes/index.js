
var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var passport = require('passport');
var User = require("../models/user");



//=============================================
// ROOT ROUTE
//=============================================
// landing page
router.get("/", function(req, res){
    // res.send("this will be the landing page soon...");
    res.render("landing.ejs");
});



//=============================================
// AUTH ROUTES
//=============================================
//------------------------------- show register form
router.get("/register", function(req, res){
    res.render("register");
});
//------------------------------- Sign Up Logic
router.post("/register", function(req, res) {
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
router.get("/login", function(req, res) {
    res.render("login");
});
//------------------------------- Handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
        
    }), function(req, res) {
    console.log("authenticate method middle ware called from POST login route");
});


//------------------------------- Logout Route
router.get("/logout", function(req, res) {
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

module.exports = router;
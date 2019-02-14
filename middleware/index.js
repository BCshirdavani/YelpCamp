// all middleware goes here

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

//------------------------------- check ownership middlewayre
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(error, foundCampground){
           if(error){
               console.log("error: ", error);
               res.redirect("back");
           } else {
               // check if user owns the campground
               console.log(typeof foundCampground.author.id,foundCampground.author.id); // mongoose object
               console.log(typeof req.user._id, req.user._id);                          // string
               console.log(req.user._id === foundCampground.author.id);                 // not the same
               if(foundCampground.author.id.equals(req.user._id)){
                   console.log("user/owner matches");
                   next();
               } else{
                   res.redirect("back");
                   console.log("user/owner does not match");
               }
           }
        });
    } else{
        console.log("user is not authenticated..need to log in");
        res.redirect("back");
    }
}
//------------------------------- check ownership middlewayre
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(error, foundComment){
           if(error){
               console.log("error: ", error);
               res.redirect("back");
           } else {
               // check if user owns the comment
               if(foundComment.author.id.equals(req.user._id)){
                   console.log("user/owner matches");
                   next();
               } else{
                   res.redirect("back");
                   console.log("user/owner does not match");
               }
           }
        });
    } else{
        console.log("user is not authenticated..need to log in");
        res.redirect("back");
    }
}


//------------------------------- is logged in middle ware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }  
    req.flash("error", "Please Login First");
    res.redirect("/login");
};



module.exports = middlewareObj;
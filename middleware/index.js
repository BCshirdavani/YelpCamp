// all middleware goes here

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

//------------------------------- check ownership middlewayre
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(error, foundCampground){
           if(error || !foundCampground){
               console.log("error: ", error);
               req.flash("error", "campground not found...");
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
                   req.flash("error", "you do not own that content...");
                   res.redirect("back");
                //   req.flash("error", "you do not own that content...");
                   console.log("user/owner does not match");
               }
           }
        });
    } else{
        console.log("user is not authenticated..need to log in");
        req.flash("error", "You must login first...");
        res.redirect("back");
    }
}
//------------------------------- check ownership middlewayre
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(error, foundComment){
           if(error || !foundComment){
               console.log("error: ", error);
               req.flash("error", "comment not found");
               res.redirect("back");
           } else {
               // check if user owns the comment
               if(foundComment.author.id.equals(req.user._id)){
                   console.log("user/owner matches");
                   next();
               } else{
                   req.flash("error", "you don't own that comment.");
                   res.redirect("back");
                   console.log("user/owner does not match");
               }
           }
        });
    } else{
        console.log("user is not authenticated..need to log in");
        req.flash("error", "You need to log in first");
        res.redirect("back");
    }
}


//------------------------------- is logged in middle ware
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }  
    req.flash("error", "You must login first...");
    res.redirect("/login");
};



module.exports = middlewareObj;
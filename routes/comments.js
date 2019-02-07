
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//  Comments Routes
//------------------------------- NEW comment - middleware blocks if not logged in
 router.get("/new",isLoggedIn ,function(req, res){
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
router.post("/", isLoggedIn, function(req, res){
   // lookup campground using id
   console.log("camp id: ", req.params.id);
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
                  // add username and id to comment, then save it
                  console.log("new comment user name will be: ", req.user.username);
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  console.log("comment: ", comment);
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect("/campgrounds/" + campground._id);
              }
          });
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
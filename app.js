
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


//------------------------------------------------------------------ DATA
    // temp data before DB implementation
    var campgrounds = [
            {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg"},
            {name: "Granite Hill", image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"},
            {name: "Fart Peak", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f7c57ea1e5b4b0_340.jpg"},
            {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg"},
            {name: "Granite Hill", image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"},
            {name: "Fart Peak", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f7c57ea1e5b4b0_340.jpg"},
            {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg"},
            {name: "Granite Hill", image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"},
            {name: "Fart Peak", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f7c57ea1e5b4b0_340.jpg"},
            {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg"},
            {name: "Granite Hill", image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"},
            {name: "Fart Peak", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f7c57ea1e5b4b0_340.jpg"},
            {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg"},
            {name: "Granite Hill", image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"},
            {name: "Fart Peak", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f7c57ea1e5b4b0_340.jpg"},
            {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2924/14465824873_026aa469d7.jpg"},
            {name: "Granite Hill", image: "https://farm4.staticflickr.com/3290/3753652230_8139b7c717.jpg"},
            {name: "Fart Peak", image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f7c57ea1e5b4b0_340.jpg"}
        ];



//------------------------------------------------------------------ ROUTES 
// landing page
app.get("/", function(req, res){
    // res.send("this will be the landing page soon...");
    res.render("landing.ejs");
});

// camp grounds route
app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

// add campground route
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect back to /campgrounds page
    res.redirect("/campgrounds");
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
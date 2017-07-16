"use strict"

const   express     = require("express"),
        router      = express.Router(),
        Campground  = require("../models/campground");

//==================
// Campground routes
//==================

//index
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//create
router.post("/", isLoggedIn, function(req, res){
   let name = req.body.name;
   let image = req.body.image;
   let desc = req.body.description;
   
   let newCampground = {name: name, image: image, description: desc}
   Campground.create(newCampground, function(err, newlyCreated){
      if(err) {
          console.log(err);
      } else {
          res.redirect("/campgrounds");
      }
   });
});

//new
router.get("/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs");
});

//show
router.get("/:id", function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err) {
          console.log
      } else {
          res.render("campgrounds/show", {campground: foundCampground});
      }
   });
});

module.exports = router;

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

"use strict"

const   express     = require("express"),
        router      = express.Router(),
        Campground  = require("../models/campground"),
        middleware  = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res){
   let name = req.body.name;
   let image = req.body.image;
   let desc = req.body.description;
   let price = req.body.price;
   let author = {
       id: req.user._id,
       username: req.user.username
   }
   let newCampground = {name: name, price:price, image: image, description: desc, author:author}
   Campground.create(newCampground, function(err, newlyCreated){
      if(err) {
          console.log(err);
      } else {
          console.log(newlyCreated);
          res.redirect("/campgrounds");
      }
   });
});

//new
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs");
});

//show
router.get("/:id", function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err) {
          req.flash("error", "Campground not found");
          res.redirect("back");
          console.log(err);
      } else {
          res.render("campgrounds/show", {campground: foundCampground});
      }
   });
});

// edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("/campgrounds");
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});            
            }
        });    
});

// update campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

// Destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           req.flash("success", "Campground Deleted");
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;

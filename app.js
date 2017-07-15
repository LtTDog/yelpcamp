"use strict"

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground")

mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
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

app.get("/campgrounds/new", function(req, res){
   res.render("new.ejs");
});


app.get("/campgrounds/:id", function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground){
      if(err) {
          console.log
      } else {
          res.render("show", {campground: foundCampground});
      }
   });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server has started");
});

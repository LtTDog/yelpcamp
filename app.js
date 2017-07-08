"use strict"

var express = require("express");
var app = express();

app.set("view engine", "ejs")

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    let campgrounds = [
            {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
            {name: "Granite Hill", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
            {name: "Mountain Goat's Rest", image: "https://farm5.staticflickr.com/4137/4812576807_8ba9255f38.jpg"}
        ]
        res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server has started");
});
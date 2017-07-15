"use strict"

const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

let data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg", 
        description: "blah blah blah"
    },
    {
        name: "remote's Rest", 
        image: "https://farm1.staticflickr.com/93/246477439_5ea3e472a0.jpg", 
        description: "blah blah blah"
    },
    {
        name: "fake's Rest", 
        image: "https://farm7.staticflickr.com/6186/6090714876_44d269ed7e.jpg", 
        description: "blah blah blah"
    }
];

function seedDB() {
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds!");
        }
    });
    
    // add a few campgrounds
    data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
            if(err){
                console.log(err);
            } else {
                console.log("added a campground");
                Comment.create({
                    text:"This place is great, but I wish there was internet",
                    author: "Homer"
                },function(err, comment){
                    if(err){
                        console.log(err);
                    } else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log("Created new comment");
                    }
                });
            }
        });    
    });
    
    //add a few comments
}

module.exports = seedDB;

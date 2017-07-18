"use strict"

const middlewareObj = {};
const Campground  = require("../models/campground");
const Comment  = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    checkOwnerShip(Campground, req.params.id, req, res, next);
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    checkOwnerShip(Comment, req.params.comment_id, req, res, next);
}

function checkOwnerShip(obj, id, req, res, next){
    if (req.isAuthenticated()) {
        obj.findById(id, function(err, found){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if(found.author.id.equals(req.user._id)){
                    next();            
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });    
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    return res.redirect("/login");
}

module.exports = middlewareObj;

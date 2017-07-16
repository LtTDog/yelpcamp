"use strict"

const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        passport    = require("passport"),
        LocalStrategy = require("passport-local"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment"),
        User        = require("./models/user"),
        seedDB      = require("./seeds");
        

mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
seedDB();

//==================
// PASSPORT CONFIGURATION
//==================

app.use(require("express-session")({
   secret: "express for the win",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================
// ROUTES
//==================

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", isLoggedIn, function(req, res){
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

app.get("/campgrounds/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs");
});


app.get("/campgrounds/:id", function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err) {
          console.log
      } else {
          res.render("campgrounds/show", {campground: foundCampground});
      }
   });
});

//==================
// Comments routes
//==================

app.get("/campgrounds/:id/comments/new", isLoggedIn,function(req, res) {
    // find campground by id and pass
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});        
        }
        
    });
    
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    //lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect to campground show page
});


//==================
// AUTH ROUTES
//==================

app.get("/register", function(req, res) {
   res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function(req, res) {
   res.render("login");
});

//handling login logic

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
    
});

//logic route
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server has started");
});

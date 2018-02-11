var express = require("express");
var app = express();
var passport = require("passport");
var localStrategy = require("passport-local");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDB = require("./seeds");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//passport config
app.use(require("express-session")({
  secret: "Secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
})

app.get("/", function(req,res){
  res.render("landing");
})

app.get("/campgrounds", function(req,res){
  Campground.find({}, function(err,campgrounds){
    if(err){
      console.log(err)
    }else {
      res.render("campgrounds/index", {campgrounds: campgrounds})
    }
  })
})

app.post("/campgrounds", function(req,res){
  //get data from form and push to array, then redirect
  var name = req.body.name;
  var imageurl = req.body.image;
  var desc = req.body.description;
  var newcamp = {name: name, image: imageurl, description: desc};
  Campground.create(newcamp, function(err,newlyCreated){
    if(err){
      console.log(err);
    }else{
      res.redirect("campgrounds");
    }
  })
})

app.get("/campgrounds/new", function(req,res){
  res.render("campgrounds/new");
})
//SHOW
app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
    if(err){
      console.log(err);
    }else {
      res.render("campgrounds/show", {site: foundCamp});
    }
  })
})

//COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, camp){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {camp: camp});
    }
  })
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, camp){
    if(err){
      console.log(err);
    }else{
      var newComment = req.body.comment;
      Comment.create(newComment, function(err, comment){
        if(err){
          console.log(err);
        }else{
          camp.comments.push(comment._id);
          camp.save();
          res.redirect("/campgrounds/" + camp._id);
        }
      })
    }
  })
})

app.get('/register', function(req,res){
  res.render('register');
})
app.post('/register', function(req,res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.render("register");
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/campgrounds");
    })
  })
})
app.get('/login', function(req,res){
  res.render("login");
})
app.post('/login',passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req,res){
})
app.get("/logout", function(req,res){
  req.logout();
  res.redirect('/campgrounds');
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, function(){
  console.log("Yelp has started");
})

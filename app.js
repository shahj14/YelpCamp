var express = require("express");
var app = express();
var passport = require("passport");
var localStrategy = require("passport-local");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var seedDB = require("./seeds");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
seedDB();

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
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

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);


app.listen(3000, function(){
  console.log("Yelp has started");
})

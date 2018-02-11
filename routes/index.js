var express =require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//root landing page
router.get("/", function(req,res){
  res.render("landing");
})

//Register page
router.get('/register', function(req,res){
  res.render('register');
})

//create user
router.post('/register', function(req,res){
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

//Login Page
router.get('/login', function(req,res){
  res.render("login");
})

//Login User
router.post('/login',passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req,res){
})

//Logout User
router.get("/logout", function(req,res){
  req.logout();
  res.redirect('/campgrounds');
})

module.exports = router;

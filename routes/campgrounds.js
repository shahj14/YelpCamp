var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
//Campground Show All page
router.get("/", function(req,res){
  Campground.find({}, function(err,campgrounds){
    if(err){
      console.log(err)
    }else {
      res.render("campgrounds/index", {campgrounds: campgrounds})
    }
  })
})

//Campground Create
router.post("/", middleware.isLoggedIn, function(req,res){
  //get data from form and push to array, then redirect
  var name = req.body.name;
  var imageurl = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newcamp = {name: name, image: imageurl, description: desc, author: author};
  Campground.create(newcamp, function(err,newlyCreated){
    if(err){
      console.log(err);
    }else{
      res.redirect("campgrounds");
    }
  })
})

//Campground Create Page
router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("campgrounds/new");
})

//Campground Show Individual
router.get("/:id", function(req,res){
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
    if(err){
      console.log(err);
    }else {
      res.render("campgrounds/show", {site: foundCamp});
    }
  })
})

//Campground Edit Form
router.get('/:id/edit',middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCamp){
    res.render('campgrounds/edit', {campground: foundCamp});
  })
})

//Campground Update Action
router.put('/:id',middleware.checkCampgroundOwnership, function(req,res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
    if(err){
      res.redirect('/campgrounds');
    }else{
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
})

//Delete Campground
router.delete('/:id',middleware.checkCampgroundOwnership, function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect('/campgrounds');
    }else{
      res.redirect('/campgrounds')
    }
  })
})

module.exports = router;

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDB = require("./seeds");

var Campground = require("./models/campground");
var Comment = require("./models/comment");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

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
      console.log(foundCamp);
      res.render("campgrounds/show", {site: foundCamp});
    }
  })
})

//COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new", function(req,res){
  Campground.findById(req.params.id, function(err, camp){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {camp: camp});
    }
  })
})

app.post("/campgrounds/:id/comments", function(req,res){
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

app.listen(3000, function(){
  console.log("Yelp has started");
})

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema set-up

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
})
var Campground = mongoose.model("Campground", campgroundSchema);
// Campground.create({
//   name: "Granite Hill",
//   image: "https://picsum.photos/250/250/?image=18",
//   description: "Awesome site. Great lighting and space!"
// },function(err, campground){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("NEW CAMP");
//     console.log(campground);
//   }
// })

app.get("/", function(req,res){
  res.render("landing");
})

app.get("/campgrounds", function(req,res){
  Campground.find({}, function(err,campgrounds){
    if(err){
      console.log(err)
    }else {
      res.render("index", {campgrounds: campgrounds})
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
  res.render("new");
})

app.get("/campgrounds/:id", function(req,res){
  Campground.findById(req.params.id, function(err, foundCamp){
    if(err){
      console.log(err);
    }else {
      res.render("show", {site: foundCamp});
    }
  })
})

app.listen(3000, function(){
  console.log("Yelp has started");
})

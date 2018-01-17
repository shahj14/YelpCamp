var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
  {name: "Salmon Hills", image: "https://picsum.photos/250/250?image=0"},
  {name: "Jeet Mountain", image: "https://picsum.photos/250/250?image=10"},
  {name: "JoJo Slides", image: "https://picsum.photos/250/250?image=20"}
]

app.get("/", function(req,res){
  res.render("landing");
})

app.get("/campgrounds", function(req,res){
  res.render("campgrounds", {campgrounds: campgrounds});
})

app.post("/campgrounds", function(req,res){
  //get data from form and push to array, then redirect
  var name = req.body.name;
  var imageurl = req.body.image;
  var newcamp = {name: name, image: imageurl};
  campgrounds.push(newcamp);
  res.redirect("campgrounds");
})

app.get("/campgrounds/new", function(req,res){
  res.render("new");
})

app.listen(3000, function(){
  console.log("Yelp has started");
})

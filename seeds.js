var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
    name: "First Camp",
    image: "https://images.unsplash.com/photo-1515529112721-c52c4bcb4f87?auto=format&fit=crop&w=1650&q=80",
    description: "This is the first camp"
  },
  {
    name: "Second Camp",
    image: "https://images.unsplash.com/photo-1515285768613-9efbec9fe26b?auto=format&fit=crop&w=1650&q=80",
    description: "This is the second camp"
  },
  {
    name: "Third Camp",
    image: "https://images.unsplash.com/photo-1516054719048-38394ee6cf3e?auto=format&fit=crop&w=2449&q=80",
    description: "This is the third camp"
  }
]

function seedDB(){
  //Remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    }else{
      console.log("deleted!");
      //Add Campgrounds in callback
      data.forEach(function(seed){
        Campground.create(seed, function(err, camp){
          if(err){
            console.log(err);
          }else {
            console.log("Added campground");
            //create comment
            Comment.create({
              text: "This is great!",
              author: "Jeet"
            }, function(err,comment){
              if(err){
                console.log(err);
              }else{
                camp.comments.push(comment._id);
                camp.save();
                console.log("created new comment");
              }
            })
          }
        });
      })
    }
  })
}

module.exports = seedDB;

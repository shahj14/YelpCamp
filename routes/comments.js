var express =require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New Page
router.get("/new", middleware.isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, camp){
    if(err){
      console.log(err);
    }else{
      res.render("comments/new", {camp: camp});
    }
  })
})

//Comments Create
router.post("/", middleware.isLoggedIn, function(req,res){
  Campground.findById(req.params.id, function(err, camp){
    if(err){
      console.log(err);
    }else{
      var newComment = req.body.comment;
      Comment.create(newComment, function(err, comment){
        if(err){
          console.log(err);
        }else{
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          camp.comments.push(comment._id);
          camp.save();
          res.redirect("/campgrounds/" + camp._id);
        }
      })
    }
  })
})

module.exports = router;

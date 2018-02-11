var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req,res,next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        res.redirect('back');
      }else{
        if(foundComment.author.id.equals(req.user._id)){
          next();
        }else{
          res.redirect('back');
        }
      }
    })
  }else{
    res.redirect("back");
  }
};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCamp){
      if(err){
        res.redirect('back');
      }else{
        if(foundCamp.author.id.equals(req.user._id)){
          next();
        }else{
          res.redirect('back');
        }
      }
    })
  }else{
    res.redirect("back");
  }
};

module.exports = middlewareObj;

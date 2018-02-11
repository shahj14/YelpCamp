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

//Comment Edit form
router.get('/:comment_id/edit',middleware.checkCommentOwnership, function(req,res){
  Comment.findById(req.params.comment_id, function(err, comment){
    if(err){
      res.redirect('back');
    }else{
      res.render('comments/edit', {comment: comment, camp_id: req.params.id});
    }
  })
})

//Comment Update Action
router.put('/:comment_id',middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
    if(err){
      res.redirect('back');
    }else{
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
})

router.delete('/:comment_id',middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect('back');
    }else{
      res.redirect('back');
    }
  })
})

module.exports = router;

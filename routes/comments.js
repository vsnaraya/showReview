var express = require("express");

var router = express.Router();
var Shoe = require("../models/shoes");
var Comment = require("../models/comments");
var middleware = require("../middleware")

router.get("/shoes/:id/comments/new",middleware.isLoggedIn, function(req, res){
    Shoe.findById(req.params.id, function(err, foundShoe){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {shoe:foundShoe});
        }
    });
});

router.post("/shoes/:id/comments", middleware.isLoggedIn, function(req, res){
    Shoe.findById(req.params.id, function(err, foundShoe){
       if(err){
           console.log(err);
           res.redirect("/shoes");
       }else{
           Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err);
                }else{
                    newComment.text = req.body.comment.text;
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    //save comment
                   newComment.save();
                   foundShoe.comments.push(newComment);
                   foundShoe.save();
                   req.flash("success", "Successfully added Comment");
                   console.log(newComment);
                   res.redirect('/shoes/' + foundShoe._id);
                }           
               
           })
       } 

    });
});

router.get("/shoes/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit",{shoe_id: req.params.id,comment:foundComment});
        }        
    });
    
});

router.put("/shoes/:id/comments/:comment_id", function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
             req.flash("success", "Successfully updated Comment");
             res.redirect('/shoes/' + req.params.id);
        }
        
    });
});

router.delete("/shoes/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
       if(err){
           console.log(err);
       }else{
            req.flash("success", "Successfully deleted Comment");
            res.redirect('/shoes/' + req.params.id);
       }
   }) 
});
module.exports = router;
    
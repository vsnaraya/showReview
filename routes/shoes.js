var express = require("express");
var router = express.Router();
var Shoe = require("../models/shoes")
var middleware = require("../middleware")


router.get("/", function(req, res){
   res.render("landing"); 
});

router.get("/shoes", function(req, res){
    Shoe.find({}, function(err, shoes){
        if(err){
            console.log(err);
        }else{
            res.render("shoes",{shoes: shoes});
        }
    });
});


router.get("/shoes/new",middleware.isLoggedIn, function(req, res){
   res.render("shoes/new"); 
});

router.post("/shoes", function(req, res){
   var name = req.body.name;
   var image = req.body.image; 
   var description = req.body.description;
   var author = {
        id: req.user._id,
        username: req.user.username
    };
   //create new campground
   var NewShoe = {name: name, image: image, description:description, author:author};
   Shoe.create(NewShoe, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
            res.redirect("/shoes");
        }
   });
});


router.get("/shoes/:id", function(req, res){
       Shoe.findById(req.params.id).populate("comments").exec(function(err, foundShoe){
       if(err){
           console.log(err);
       } else{
            res.render("shoes/show", {shoe:foundShoe});
       }
    });
    
});

router.get("/shoes/:id/edit",middleware.checkShoeOwnership, function(req, res){
    Shoe.findById(req.params.id, function(err, foundShoe){
            if(err){
                console.log(err);
            }else{
                    res.render("shoes/edit", {shoe:foundShoe});
            }
    });
});

router.put("/shoes/:id" , function(req, res){
    Shoe.findByIdAndUpdate(req.params.id, req.body.shoe, function(err, updatedShoe){
        if(err){
               console.log(err);
               res.redirect("/shoes");
           } else {
               //redirect somewhere(show page)
               req.flash("success", "Successfully updated Shoe!");
               res.redirect("/shoes/" + req.params.id);
           }
    });
});

router.delete("/shoes/:id",middleware.checkShoeOwnership, function(req, res){
    Shoe.findByIdAndRemove(req.params.id, function(err, removedShoe){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Shoe deleted!");
            res.redirect("/shoes");
        }
   }); 
});


module.exports = router;

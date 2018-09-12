var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/users");
var middleware = require("../middleware");


router.get("/", function(req, res){
    res.render("landing");
});
//==================
//adding auth routes

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  
  var newUser = {username: username};
  User.register(newUser,password, function(err,newUser){
      if(err){
          console.log(err);
          return res.render("register");
      }
          console.log(newUser);
          passport.authenticate("local")(req, res, function(){
              res.redirect("/shoes");
          });
    });
});


//=============
//adding login forms 

router.get("/login", function(req,res){
    req.flash("success", "successfully logged in");
    res.render("login");
});

router.post("/login", passport.authenticate("local",
        {
            successRedirect:"/shoes", 
            failureRedirect: "/login"
        }), function(req, res){
});

//==============
//adding logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged out!");
   res.redirect("/");
});


module.exports = router;
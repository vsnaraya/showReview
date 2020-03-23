var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var methodOverride = require("method-override");
var Shoe = require("./models/shoes");
var shoeRoutes = require("./routes/shoes");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
var  passport = require("passport");
var  User = require("./models/users");
var  LocalStrategy = require("passport-local");
var flash = require("connect-flash");

mongoose.connect("mongodb://localhost:27017/shoe_review", {useNewUrlParser: true });
//mongoose.connect("mongodb://vinay:vballer18sc4@ds151602.mlab.com:51602/shoereview");

app.use(bodyparser.urlencoded({ extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());



app.use(require("express-session")({
    secret: " I am a real one",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use( function(req, res, next) {
    res.locals.currentUser = req.user;c
   //console.log(req.user);
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
   next();
});


app.use(shoeRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("The ShoeReview Server Has Started!");
});
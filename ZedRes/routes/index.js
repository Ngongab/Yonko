var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", function(req, res){
	res.render("landing");
});


router.get("/signup", function(req, res){
	res.render("signup");
});

//handle sign up logic

router.post("/signup", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			req.flash("error", err.message);
			return res.render("signup");
		}	
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Zed Resturants " + user.username);
			res.redirect("/resturants");
		});	
	});
});

//show login form

router.get("/login", function(req, res){
	res.render("login");
});

//handle login logic

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/resturants",
		failureRedirect: "/login"
	}), function(req, res){
});

//logout route

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You logged out");
	res.redirect("/resturants");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to logged in to do that");
	res.redirect("/login");
}

module.exports = router;
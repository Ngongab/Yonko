var express = require("express");
var router = express.Router();
var resturant = require("../models/resturant");


//INDEX - show all restrurants
router.get("/", function(req, res){
	//get all resturants from db
	resturant.find({}, function(err, resturants){

		if (err) {
			console.log(err);
		} else {
			 res.render("resturants/index", {resturants: resturants});
		}
	});	
});

//CREATE - add new resturant to db
router.post("/", isLoggedIn, function(req, res){
	//get data from the form and add resturants array
	var name = req.body.name;
	var image = req.body.image; 
	var price = req.body.price;               
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newResturant = {name: name, price: price, image: image, description: description, author: author}
	//create a new resturant and save to the db
	resturant.create(newResturant, function(err, newResturant){

		if (err) {
			console.log(err);
		} else {
			//redirect to the resturants page
			res.redirect("/resturants");
		}
	});	
});

//NEW - show form to create new resturant
router.get("/new", isLoggedIn, function(req, res){
	res.render("resturants/new");
});

//SHOW shows more info about one item
router.get("/:id", function(req, res){
	//find the resturant with provided id
	resturant.findById(req.params.id).populate("comments").exec(function(err, foundResturant){

		if (err) {
			console.log(err);
		} else {
			console.log(foundResturant);
			//render show template with that resturant
			res.render("resturants/show", {resturant: foundResturant});
		}
	});	
});

//EDIT RESTURANTS ROUTE
router.get("/:id/edit", checkRestaurantOwnership, function(req, res){
	resturant.findById(req.params.id, function(err, foundResturant){	
		res.render("resturants/edit", {resturant: foundResturant});
	});
});

//UPDATE RESTURANTS ROUTE

router.put("/:id", checkRestaurantOwnership, function(req, res){
	//find and update the right reataurant
	resturant.findByIdAndUpdate(req.params.id, req.body.resturant, function(err, updatedRestaurant){
		if (err) {
			res.redirect("/resturants");
		} else {
			res.redirect("/resturants/" + req.params.id);
		}
	});
});

//DESTROY RESTAURANT
router.delete("/:id", checkRestaurantOwnership, function(req, res){
	resturant.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/resturants");
		} else {
			res.redirect("/resturants");
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to logged in to do that");
	res.redirect("/login");
}

// authorization to check for the right user

function checkRestaurantOwnership(req, res, next){
	if(req.isAuthenticated()){
		resturant.findById(req.params.id, function(err, foundResturant){
			if (err) {
				req.flash("error", "Resturant not found");
				res.redirect("back");
			} else {
				//does the user own the restaurant
				if (foundResturant.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
		} else {
			req.flash("error", "You dont have permission to do that");
			res.redirect("back");
		}
}  

module.exports = router;


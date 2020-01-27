var Resturant = require("../models/resturant");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkRestaurantOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		resturant.findById(req.params.id, function(err, foundResturant){
			if (err) {
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
			res.redirect("back");
		}
}  


middlewareObj.checkCommentsOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err) {
				res.redirect("back");
			} else {
				//does the user own the comment
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
		} else {
			res.redirect("back");
		}
}  

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = middlewareObj;
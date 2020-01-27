var express = require("express");
var router = express.Router({mergeParams: true});
var resturant = require("../models/resturant");
var Comment = require("../models/comment");

//comments new
router.get("/new", isLoggedIn, function(req, res){
	// find resturant by id
	resturant.findById(req.params.id, function(err, resturant){
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {resturant: resturant});
		}
	});
	
});

// comments create
router.post("/", isLoggedIn ,function(req, res){
	// lookup resturants using id
	resturant.findById(req.params.id, function(err, resturant){
		if (err) {
			req.flash("error", "Something went wrong");
			console.log(err);
			res.redirect("/resturants");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment  
					comment.save(); 
					resturant.comments.push(comment);
					resturant.save();
					req.flash("success", "Successfully added comment");
					res.redirect('/resturants/' + resturant._id);
				}
			});
		}
	});
});

//COMMENT EDIT
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {resturant_id: req.params.id, comment: foundComment});
		}
	});
});

//COMENTS UPDATE
router.put("/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/resturants/" + req.params.id);
		}
	});
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", function(req, res){
	//findByIdAndRemove 
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/resturants/" + req.params.id);
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

function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err) {
				res.redirect("back");
			} else {
				//does the user own the comment
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
		} else {
			req.flash("error", "You need to logged in to do that");
			res.redirect("back");
		}
}  

module.exports = router;
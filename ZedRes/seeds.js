var mongoose = require("mongoose");
var resturant = require("./models/resturant");
var Comment = require("./models/comment");

var data = [ 
		{
			name: "Chicago's", 
			image: "https://res.cloudinary.com/dhsjpmqz9/f_auto,q_auto,w_700/cjlme1gne001501rzlvs3wqpr", 
			description: "Chicago reloaded is a must visit place with Lusaka Town for a good night experience. The place offer a kind of outdoor chill for fresh air and night sky view. Though mostly crowded and sometimes the service is quite bad due to trying to meet almost all clients needs, the staff are friendly and professional.For a good treatment experience having a seat in the VIP will help you have quick service and a view of the place of the place from all angles.Great music at the place and very friendly people around the place who are all down for fun.For a great night the place is a must visit."
		},

		{
			name: "Ocean Basket", 
			image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/d7/ee/38/ocean-basket.jpg", 
			description: "Ocean Basket offers sea food, with alcohol and delicious food to enjoy with friends and family"
		},

		{
			name: "Nando's", 
			image: "https://res.cloudinary.com/dhsjpmqz9/f_auto,q_auto/cjlmgrifz002401qlsq4bc57c", 
			description: "Nando's offers alcohol and delicious food to enjoy with friends and family"
		},

			
		{
			name: "Spur", 
			image: "https://media-cdn.tripadvisor.com/media/photo-s/08/08/94/77/best-restaurant-in-lusaka.jpg", 
			description: "Spur offers alcohol and delicious food to enjoy with friends and family"
		}
			
	]

function seedDB(){
	// Remove all resturants
	resturant.remove({}, function(err){
		if (err) {
			console.log(err);
		} else {
			console.log("Removed resturants");
		}
		// add a few resturants
		data.forEach(function(seed){
			resturant.create(seed, function(err, resturant){
				if (err) {
					console.log(err);
				} else {
					console.log("added a resturant");
					//create a comment
					Comment.create({
						text: "This place is great wish i could come here often",
						author: "CMB"
					}, function(err, comment){
						if (err) {
							console.log(err);
						} else {
							resturant.comments.push(comment);
							resturant.save();
							console.log("Created new comment");
						}
						
					});
				}
			});
		});
	});
}

module.exports = seedDB;
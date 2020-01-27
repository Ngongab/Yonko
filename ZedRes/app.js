
var  express = require("express"),
	 app = express(),
	 port = 3000,	
	 bodyparser = require("body-parser"),
     mongoose = require("mongoose"),
     flash = require("connect-flash"),
     passport = require("passport"),
     LocalStrategy = require("passport-local"),
     methodOverride = require("method-override"),
     resturant = require("./models/resturant"),
     Comment = require("./models/comment"),
     User = require("./models/user"),
     seedDB = require("./seeds") 

var commentRoutes = require("./routes/comments"),
	 resturantRoutes = require("./routes/resturants"),
	 indexRoutes = require("./routes/index")

mongoose.connect('mongodb://localhost/zed_res', {useNewUrlParser: true});
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database


 //PASSPORT CONFIGURATION
 app.use(require("express-session")({
 	secret: "The Best resturants in Zed",
 	resave: false,
 	saveUninitialized: false
 }));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

 app.use(function(req, res, next){
 	res.locals.currentUser = req.user;
 	res.locals.error = req.flash("error");
 	res.locals.success = req.flash("success");
 	next();
 });

app.use("/", indexRoutes);    
app.use("/resturants", resturantRoutes);    
app.use("/resturants/:id/comments", commentRoutes);    

app.listen(port, () => console.log("Zed Res Server has started", `Listening on port ${port}!`));
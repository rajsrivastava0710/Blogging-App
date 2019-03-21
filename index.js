var express     = require("express"),
app			    = express(),
methodOverride  =require("method-override"),
expressSanitizer=require("express-sanitizer"),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose");

mongoose.connect("mongodb://localhost/blogger",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
//express sanitizer should be below body parser
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");

var blogSchema =new mongoose.Schema({
	title: String,
	image: String,
	body:String,
	writer:String,
	created: 
	{
		type: Date, 
		default: Date.now
	}
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title: "Full Stack Developer",
// 	image: "https://skillvalue.com/jobs/wp-content/uploads/sites/7/2018/08/full-stack-development.jpg",
// 	body: "Works on both front end and backend!"
// });

//RESTFUL Routes

app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/contacts",function(req,res){
	res.render("contacts.ejs");
});

app.get("/top_writers",function(req,res){
	res.render("writers.ejs");
});

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});	
});

app.get("/blogs/new",function(req,res){
	res.render("new");
});

app.post("/blogs",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog:foundBlog});
		}
	});
});

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	});
});

app.put("/blogs/:id",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//can use Blog.findByIdAndUpdate
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}

	});
});

app.delete("/blogs/:id",function(req,res){
	//findByIdAnd Remove
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.listen(3000,function(){
	console.log("Server started!");
});
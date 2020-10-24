let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let expressSanitizer= require("express-sanitizer");
let methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blogdata",{useNewUrlParser:true,useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//mongoose model config
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date,default: Date.now}
});

let Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title: "testblog",
//     image: "https://images.unsplash.com/photo-1517607648415-b431854daa86?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=892&q=80",
//     body: "Love is eternal"
// });

//RESTful routes
app.get("/",function(req,res){
    res.redirect("/blogs");
})

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

app.get("/blogs/new", function(req,res){
    res.render("new");
});
//create route
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(
        req.body.blog
    ,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundblog});
        }
    });
   
});

//update route
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlod){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog:foundBlog});
        }
    })
});

//destroy route
app.delete("/blogs/:id",function(req,res){
   // res.send("Delete route");
    Blog.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
 
});



app.listen(3000);
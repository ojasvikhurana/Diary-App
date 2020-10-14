let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blogdata",{useNewUrlParser:true,useUnifiedTopology:true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

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

//create route
app.post("/blogs",function(req,res){
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

app.get("/blogs/new", function(req,res){
    res.render("new");
})

app.listen(3000);
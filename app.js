//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to the Daily Journal";
const aboutContent = "";
const contactContent = "";

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//opening a connection to the blogDB database and running an instance of mongoose
mongoose.connect("mongodb+srv://admin-viktorb:Test123@cluster0.ln2np.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

//In mongoose everything is derived from a schema: 
const postSchema = {
  title:String,
  content:String
};

//complile the schema into a model: 
const Post = mongoose.model('Post', postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/about",function(req,res){
  res.render("about",{
    AboutContent:aboutContent
  });
});

app.get("/contact",function(req,res){
  res.render("contact",{
    ContactSection:contactContent
  });
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
});

app.post("/compose",function(req,res){
  const post = new Post({
    title:req.body.postTitle,
    content:req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.post("/delete", function(req,res){
  const deletedPost = req.body.deletebtn;

  Post.findByIdAndRemove(deletedPost, function(err){
    if(!err){
      console.log("successfully removed post");
      res.redirect("/");
    }
  });
});

let port = process.env.PORT;
if(port == null || port ==""){
  port = 3000;
}

app.listen(port, function(){
  console.log("Server started successfully");
});


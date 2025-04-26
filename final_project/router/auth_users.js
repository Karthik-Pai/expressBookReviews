const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const validusers = users.filter((user)=>{
    return user.username === username;
  });

  if(validusers.length>1){
    return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const authenticatedusers = users.filter((user)=>{
    return(user.username === username && user.password === password);
  })

  if(authenticatedusers.length>1){
    return true;
  }else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username &&  password){
    if(isValid(username)){
      if(authenticatedUser(username, password)){
        const accessToken = jwt.sign({"username":username, "password":password}, 
          'secret', 
          {expiresIn:60*60})

          req.session.authorization = {
            "accessToken":accessToken,
            "username": username
          }
        
        res.status(200).send({message:`Hi ${username}, you have logged in successfully!`});
      }else{
        res.status(401).send({message:"Invalid username or password"});
      }
    }else{
      res.status(401).send({message:"Invalid username or password"});
    }
  }else{
    return res.status(400).send({message:"Username and password are required"})
  }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if(!review){
    return res.status(400).send({message:"Review is required"});
  }

  const username = req.user.username;

  if(books[isbn]){
    books[isbn].reviews[username] = review;
    res.status(200).send({message:"Review posted successfully!"});
  }else{
    res.status(404).send({message:"Book not found"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
  const isbn = req.params.isbn;

  const username = req.user.username;
  console.log(req.user);

  if(books[isbn]){
    delete books[isbn].reviews[username];
    res.status(200).send({message:"Review deleted successfully!"});
  }else{
    res.status(404).send({message:"Book not found"});
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

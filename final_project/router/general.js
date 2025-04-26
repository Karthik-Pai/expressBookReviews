const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).send({message:"Username and password are required"});
  }else{
    if(isValid(username)){
      users.push({"username":username, "password":password});
      return res.status(200).send({message:"User added successfully!"});
    }else{
      return res.status(409).send({message:"Username already exists"});
    }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res){
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const books_by_author = {};
  Object.entries(books).forEach(([key, value])=>{
    if(value.author === author){
      books_by_author[key] = value;
    }
  })
  return res.status(200).send(JSON.stringify(books_by_author, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  Object.entries(books).forEach(([key,value])=>{
    if(value.title === title){
      return res.status(200).send(value);
    }
  })

  return res.status(404).send({message:"The book with the given title was not found"});
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  Object.entries(books).forEach(([key, value])=>{
    if(key === isbn){
      return res.status(200).send(value.reviews);
    }
  })
});

public_users.get('/async-books', async (req,res)=>{
  try{
    const response = await axios.get('http://localhost:5000/');
    res.status(200).send(response.data);
  }catch(err){
    res.status(500).send({message:"Error fetching books"});
  }
})

public_users.get('/async-isbn/:isbn', async (req,res)=>{
  const isbn = req.params.isbn;
  try{
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).send(response.data);
  }catch(err){
    res.status(500).send({message:"Error fetching books by ISBN"});
  }
})

public_users.get('/async-author/:author', async (req,res)=>{
  const author = req.params.author;
  try{
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.status(200).send(response.data);
  }catch(err){
    res.status(500).send({message:"Error fetching books by author"});
  }
})

public_users.get('/async-title/:title', async (req,res)=>{
  const title = req.params.title;
  try{
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.status(200).send(response.data);
  }catch(err){
    res.status(500).send({message:"Error fetching books by author"});
  }
})


module.exports.general = public_users;

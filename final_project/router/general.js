const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const Username = req.body.username;
  const Password = req.body.password;
  if(!Username || !Password){
    return res.status(404).json({message: "Invalid: username or password not provided"});
  }else{
    let user = users.filter((user)=>(
        user.username === Username
    ))
    if(user.length > 0){
        return res.status(404).json({message: "Invalid: username already exists"});
    }else{
        users.push({"username": Username, "password": Password})
        return res.status(200).json({message: "User registered successfully"});
    }
  }
  
});

public_users.get('/', function (req, res) {
  const booklist = Object.values(books).map(book => book.title);
  return res.json(booklist);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filtered_books = Object.values(books).filter(book => book.isbn === isbn )
    return res.json(filtered_books);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_by_author = Object.values(books).filter(book => book.author === author) 
  return res.status(300).json(filtered_by_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
let title  = req.params.title.replace(/[:\\"]/g,'');
let filtered_by_title = Object.values(books).filter(book => book.title === title) 

  return res.status(300).json(filtered_by_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let filtered_by_isbn = Object.values(books).filter(book => book.isbn === isbn);

  return res.status(300).json(filtered_by_isbn[0].reviews);
});

module.exports.general = public_users;

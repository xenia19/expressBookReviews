const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

let users = [];


const isValid = (username)=>{ 
    const User = users.filter((user)=>(
        user.username===username
    ))
    if(User.length>0){
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ 
    if(isValid(username)){
        const User = users.filter((user)=>(
            user.username===username && user.password === password
        ))
        if(User.length>0){
            return true;
        }
    }
 
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const Username = req.body.username;
    const Password = req.body.password;
    if(!Username || !Password){
        return res.status(404).json({message: "Username or password is empty string"});
    }else{
        if(authenticatedUser(Username, Password)){
            let accessToken  = jwt.sign({
                data: Password
            }, 'access', { expiresIn: 60 * 60 });

            req.session.authorization = {
               accessToken, Username
            }
            console.log(accessToken);
            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error" });
                }
                return res.status(200).json({ message: "User logged in successfully" });
            });
        } else {
            return res.status(208).json({ message: "Invalid Login. Check username and password" });
        }
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if(req.session.authorization){
        const user = req.session.authorization["Username"]
        const ISBN = req.params.isbn;
        const review = req.body.review;
        
        if(Object.keys(books[ISBN]["reviews"]).includes(user)){
            books[ISBN]["reviews"][user] = review;
            return res.status(200).json({ message: "Review updated successfully" });
        }else{
            books[ISBN]["reviews"][user] = review;
            return res.status(200).json({ message: "Added new review successfully" });
        }  
    }else{
        return res.status(403).json({ message: "User not logged in" });
    }

});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    if(req.session.authorization){
        const user = req.session.authorization["Username"]
        const ISBN = req.params.isbn;
        if(Object.keys(books[ISBN]["reviews"]).includes(user)){
            delete books[ISBN]["reviews"][user];
            return res.status(200).json({ message: "Review deleted successfully" });
        }else{
            return res.status(200).json({ message: "User haven't posted any reviews yet" });
        }  
    }else{
        return res.status(403).json({ message: "User not logged in" });
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
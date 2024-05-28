const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find(user => user.username === username && user.password === password);
    return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
      return res.status(400).json({ message: "Invalid username" });
    }
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid password" });
    }
  
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
  });

  const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).json({ message: "A token is required for authentication" });
    }
    try {
      const decoded = jwt.verify(token, "fingerprint_customer");
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    return next();
  };

  regd_users.use("/auth/*", verifyToken);
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

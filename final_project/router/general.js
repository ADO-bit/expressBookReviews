const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
const genl_routes = express.Router();

// Task 10: Get the list of books available in the shop using Async-Await
genl_routes.get('/books', async (req, res) => {
    try {
        const bookList = await getBooks();
        res.json(bookList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
});

const getBooks = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000);
    });
}

// Task 11: Get the book details based on ISBN using Async-Await
genl_routes.get('/books/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const book = await getBookByISBN(isbn);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
});

const getBookByISBN = async (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                resolve(null);
            }
        }, 1000);
    });
}

// Task 12: Get the book details based on Author using Async-Await
genl_routes.get('/books/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const bookList = await getBooksByAuthor(author);
        if (bookList.length > 0) {
            res.json(bookList);
        } else {
            res.status(404).json({ message: 'Books not found for the specified author' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
});

const getBooksByAuthor = async (author) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
            resolve(result);
        }, 1000);
    });
}

// Task 13: Get the book details based on Title using Async-Await
genl_routes.get('/books/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const bookList = await getBooksByTitle(title);
        if (bookList.length > 0) {
            res.json(bookList);
        } else {
            res.status(404).json({ message: 'Books not found for the specified title' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
});

const getBooksByTitle = async (title) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
            resolve(result);
        }, 1000);
    });
}

module.exports.general = genl_routes;

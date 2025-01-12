const LibraryBook = require('../models/libraryBook');
const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const libraryBookController = {
    saveBook: async (req, res) => {
        const {userId, bookId, status} = req.body;

        try {
            const result = await LibraryBook.saveBook(userId, bookId, status);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error saving book:', error);
            res.status(500).json({message: 'Failed to save book to library', error: error.message});
        }
    },

    deleteBook: async (req, res) => {
        const {userId, bookId} = req.params;

        const token = req.cookies.token;

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const username = decoded.username;
            const result = await LibraryBook.deleteBook(userId, bookId);
            res.redirect(`/library/${username}`);
        } catch (error) {
            console.error('Error deleting book:', error);
            res.status(500).json({message: 'Failed to delete book from library', error: error.message});
        }
    },

    getUserBooks: async (req, res) => {
        const {username} = req.params;

        try {
            const userBooks = await LibraryBook.getUserBooks(username);
            res.render('library/libraryBooks', {books: userBooks, user: req.user});
        } catch (err) {
            console.error('Error retrieving user books:', err);
            res.status(500).json({error: 'Failed to retrieve user books'});
        }
    },

    getLibraryBookDetails: async (req, res) => {
        const {bookId} = req.params;

        const token = req.cookies.token;

        try {
            const decoded = verify(token, JWT_SECRET);
            const userId = decoded.id;
            const username = decoded.username;

            const book = await LibraryBook.getLibraryBookDetails(userId, bookId);

            if (!book.google_id) {
                return res.status(401).json({error: 'Book Not Found'});
            }

            res.render('library/libraryBookDetails', {book, username});
        } catch (err) {
            console.error(err);
            res.status(500).send('Error retrieving book details.');
        }
    },

    updateBookStatus: async (req, res) => {
        const bookId = req.params.bookId.trim();
        const newStatus = req.body.status;

        const token = req.cookies.token;

        try {
            const decoded = verify(token, JWT_SECRET);
            const userId = decoded.id;

            const book = await LibraryBook.updateBookStatus(userId, bookId, newStatus);
            res.redirect('back');
        } catch (err) {
            console.error('Error updating book status:', err);
            res.status(500).send('Error updating status');
        }
    }
};

module.exports = libraryBookController;

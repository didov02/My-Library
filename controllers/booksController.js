const Book = require('../models/book');
const db = require('../db')

const booksController = {
    searchBook: async (req, res) => {
        const { query } = req.query; 
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        try {
            const books = await Book.searchBook(query);
            res.render('books/search', { query, results: books});
        } catch (err) {
            console.error('Error searching for books:', err);
            res.status(500).json({ error: 'Failed to fetch books' , details: err.message});
        }
    },

    saveBook: async (req, res) => {
        const book = req.body;
        const username = req.user.username;

        if (!book || !book.id) {
            return res.status(400).json({ error: 'Valid book data is required' });
        }

        try {
            await Book.saveBook(book, username);
            res.status(201).json({ message: 'Book saved successfully' });
        } catch (err) {
            console.error('Error saving the book:', err);
            res.status(500).json({ error: 'Failed to save the book' });
        }
    },

    getBookDetails: async (req, res) => {
        const { bookId } = req.params;
        const { query } = req.query;

        try {
            const bookDetails = await Book.getBookDetails(bookId);

            if (!bookDetails) {
                return res.status(404).json({ error: 'Book not found' });
            }

            res.render('books/details', { book: bookDetails, query: query });
        } catch (err) {
            console.error('Error fetching book details:', err);
            res.status(500).json({ error: 'Failed to fetch book details', details: err.message });
        }
    },
};

module.exports = booksController;
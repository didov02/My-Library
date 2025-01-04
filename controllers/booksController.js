const Book = require('../models/book');

const booksController = {
    searchBook: async (req, res) => {
        const { query } = req.query; 
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        try {
            const books = await Book.searchBook(query);
            res.json(books);
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
    }
};

module.exports = booksController;
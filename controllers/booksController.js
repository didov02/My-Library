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
            res.status(500).json({ error: 'Failed to fetch books' });
        }
    },

    saveBook: async (req, res) => {
        const book = req.body;

        if (!book || !book.id) {
            return res.status(400).json({ error: 'Valid book data is required' });
        }

        try {
            await Book.saveBook(book);
            res.status(201).json({ message: 'Book saved successfully' });
        } catch (err) {
            console.error('Error saving the book:', err);
            res.status(500).json({ error: 'Failed to save the book' });
        }
    }
};

module.exports = booksController;
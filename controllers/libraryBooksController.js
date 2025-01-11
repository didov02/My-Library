const LibraryBook = require('../models/libraryBook');

const libraryBookController = {
    saveBook: async (req, res) => {
        const { userId, bookId, status } = req.body;

        try {
            const result = await LibraryBook.saveBook(userId, bookId, status);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error saving book:', error);
            res.status(500).json({ message: 'Failed to save book to library', error: error.message });
        }
    },

    deleteBook: async (req, res) => {
        const { userId, bookId } = req.params;

        try {
            const result = await LibraryBook.deleteBook(userId, bookId);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error deleting book:', error);
            res.status(500).json({ message: 'Failed to delete book from library', error: error.message });
        }
    },

    getUserBooks: async (req, res) => {
        const { username } = req.params;

        try {
            const userBooks = await LibraryBook.getUserBooks(username);
            res.render('library/libraryBooks', { books: userBooks, user: req.user });
        } catch (err) {
            console.error('Error retrieving user books:', err);
            res.status(500).json({ error: 'Failed to retrieve user books' });
        }
    },
};

module.exports = libraryBookController;

const LibraryBook = require('../models/libraryBook');

const libraryBooksController = {
    getAllLibraryBooks: async (req, res) => {
        const userId = req.userId;
        try {
            const libraryBooks = await LibraryBook.getLibraryBooks(userId);
            res.render('library/libraryBooks', {libraryBooks: libraryBooks});
        } catch (err) {
            res.status(500).json({error: "Failed to fetch library books"});
        }
    },

    removeBook: async (req, res) => {
        const {userId, bookId} = req.params;
        try {
            const response = await LibraryBook.removeBookFromLibrary(userId, bookId);
            res.status(200).json(response);
        } catch (err) {
            res.status(500).json({error: "Failed to remove library book"});
        }
    },

    updateLibraryBook: async (req, res) => {
        const {userId, bookId, status} = req.params;

        try {
            const updatedBook = await LibraryBook.updateBookStatus(userId, bookId, status);
            res.status(200).json(updatedBook);
        } catch (err) {
            res.status(500).json({error: "Failed to update status of library book"});
        }
    }
}

module.exports = libraryBooksController;
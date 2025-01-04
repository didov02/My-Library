const db = require('../db.js');

const LibraryBook = {
    saveBook: async (userId, bookId, status) => {
        try {
            // First, check if the book is already in the library for the user
            const [existingLibraryBook] = await db.promise().query(
                "SELECT * FROM LibraryBooks WHERE user_id = ? AND book_id = ?",
                [userId, bookId]
            );

            if (existingLibraryBook.length > 0) {
                // If the book exists in the library, just update the status
                return { message: "Book is already in user's library." };
            }

            // Finally, insert the book into the user's library (LibraryBooks table)
            await db.promise().query(
                "INSERT INTO LibraryBooks (user_id, book_id, status) VALUES (?, ?, ?)",
                [userId, bookId, status]
            );

            return { message: "Book added to library." };
        } catch (error) {
            console.error('Error saving book to library:', error);
            throw error;
        }
    },

    deleteBook: async (userId, bookId) => {
        try {
            // Check if the book is in the user's library
            const [existingLibraryBook] = await db.promise().query(
                "SELECT * FROM LibraryBooks WHERE user_id = ? AND book_id = ?",
                [userId, bookId]
            );

            if (existingLibraryBook.length === 0) {
                return { message: "Book not found in user's library." };
            }

            // Remove the book from the LibraryBooks table
            await db.promise().query(
                "DELETE FROM LibraryBooks WHERE user_id = ? AND book_id = ?",
                [userId, bookId]
            );

            return { message: "Book removed from library." };
        } catch (error) {
            console.error('Error deleting book from library:', error);
            throw error;
        }
    }
};

module.exports = LibraryBook;
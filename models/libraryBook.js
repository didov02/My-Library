const db = require('../db.js');
const Book = require('./book');  // Importing the Book model to check and add books

const LibraryBook = {
    saveBook: async (userId, bookId, status) => {
        try {
            // Check if the book is already in the LibraryBooks table
            const [existingLibraryBook] = await db.promise().query(
                "SELECT * FROM LibraryBooks WHERE user_id = ? AND book_id = ?",
                [userId, bookId]
            );

            if (existingLibraryBook.length > 0) {
                // Book already exists in the user's library, so just update the status if necessary
                await db.promise().query(
                    "UPDATE LibraryBooks SET status = ? WHERE user_id = ? AND book_id = ?",
                    [status, userId, bookId]
                );
                return { message: "Book status updated in library." };
            }

            // Check if the book exists in the Books table
            const [existingBook] = await db.promise().query(
                "SELECT * FROM Books WHERE id = ?",
                [bookId]
            );

            if (existingBook.length === 0) {
                // Book does not exist in the Books table, fetch data from Google Books API
                const bookData = await Book.searchBook(bookId);

                // If book data is found, save it in the Books table
                if (bookData) {
                    await Book.saveBook(bookData);
                }
            }

            // Add the book to the LibraryBooks table
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
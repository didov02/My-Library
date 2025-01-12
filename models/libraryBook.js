const db = require('../db.js');

const LibraryBook = {
    saveBook: async (userId, bookId, status) => {
        try {
            const [existingLibraryBook] = await db.promise().query(
                "SELECT * FROM LibraryBooks WHERE user_id = ? AND book_id = ?",
                [userId, bookId]
            );

            if (existingLibraryBook.length > 0) {
                return {message: "Book is already in user's library."};
            }

            await db.promise().query(
                "INSERT INTO LibraryBooks (user_id, book_id, status) VALUES (?, ?, ?)",
                [userId, bookId, status]
            );

            return {message: "Book added to library."};
        } catch (error) {
            console.error('Error saving book to library:', error);
            throw error;
        }
    },

    deleteBook: async (userId, bookId) => {
        try {
            const [existingLibraryBook] = await db.promise().query(
                "SELECT * FROM LibraryBooks WHERE user_id = ? AND book_id = ?",
                [userId, bookId]
            );

            if (existingLibraryBook.length === 0) {
                return {message: "Book not found in user's library."};
            }

            await db.promise().query(
                "DELETE FROM LibraryBooks WHERE user_id = ? AND book_id = ?",
                [userId, bookId]
            );

            return {message: "Book removed from library."};
        } catch (error) {
            console.error('Error deleting book from library:', error);
            throw error;
        }
    },

    getUserBooks: async (username) => {
        try {
            const [userResult] = await db.promise().query(
                "SELECT id FROM Users WHERE username = ?",
                [username]
            );

            if (userResult.length === 0) {
                throw new Error('User not found');
            }

            const userId = userResult[0].id;

            const [userBooks] = await db.promise().query(
                `SELECT b.google_id, b.title, b.author_name, b.genre, b.year_of_publication, b.description, b.cover_image, lb.status
                 FROM LibraryBooks lb
                 JOIN Books b ON lb.book_id = b.google_id
                 WHERE lb.user_id = ?`,
                [userId]
            );

            return userBooks;
        } catch (error) {
            console.error('Error retrieving user books from library:', error);
            throw error;
        }
    },

    getLibraryBookDetails: async (userId, bookId) => {
        try {
            const [bookDetails] = await db.promise().query(
                `select b.google_id, b.title, b.author_name, b.genre, b.year_of_publication, b.description, b.cover_image, lb.status
             from LibraryBooks lb join books b on lb.book_id = b.google_id
             where lb.user_id = ? and lb.book_id = ?`, [userId, bookId]
            );

            if (bookDetails.length === 0) {
                return {message: "Book details not found"};
            }

            return bookDetails[0];
        } catch (err) {
            console.error('Error retrieving book details from library:', err);
        }
    },

    updateBookStatus: async (userId, bookId, status) => {
        try {
            const [bookDetails] = await db.promise().query(
                `Update libraryBooks Set status = ? where user_id = ? AND book_id = ?`,
                [status, userId, bookId]
            );

            return bookDetails;
        } catch (err) {
            console.error('Error updating book status:', err);
        }
    }
};

module.exports = LibraryBook;
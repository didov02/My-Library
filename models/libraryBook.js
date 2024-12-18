const db = require("../db.js");

const LibraryBook = {
    updateBookStatus: async (userId, bookId, status) => {
        const query = 'UPDATE LibraryBooks SET status = ? WHERE user_id = ? AND book_id = ?';
        try {
            const [result] = await db.promise().query(query, [status, userId, bookId]);
            if (result.affectedRows === 0) {
                throw new Error('Book not found in the library');
            }
            return {userId, bookId, status};
        } catch (err) {
            throw new Error('Failed to update book status: ' + err.message);
        }
    },

    removeBookFromLibrary: async (userId, bookId) => {
        const query = 'DELETE FROM LibraryBooks WHERE user_id = ? AND book_id = ?';
        try {
            const [result] = await db.promise().query(query, [userId, bookId]);
            if (result.affectedRows === 0) {
                throw new Error('Book not found in the library');
            }
            return {message: 'Book removed from library'};
        } catch (err) {
            throw new Error('Failed to remove book: ' + err.message);
        }
    },

    getLibraryBooks: async (userId) => {
        const query = 'SELECT * FROM LibraryBooks WHERE user_id = ?';
        try {
            const [rows] = await db.promise().query(query, [userId]);
            return rows;
        } catch (err) {
            throw new Error('Failed to get library books: ' + err.message);
        }
    }
}

module.exports = LibraryBook;
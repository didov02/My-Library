const db = require('../db.js');

const Rating = {
    addRating: async (userId, bookId, rating, review) => {
        try {
            const [result] = await db.promise().query(
                "INSERT INTO Ratings (user_id, book_id, rating, review) VALUES (?, ?, ?, ?)",
                [userId, bookId, rating, review]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error adding rating:', error);
            throw error;
        }
    },

    deleteRating: async (ratingId, userId) => {
        try {
            const [result] = await db.promise().query(
                "DELETE FROM Ratings WHERE id = ? AND user_id = ?",
                [ratingId, userId]
            );
            return result.affectedRows > 0; 
        } catch (error) {
            console.error('Error deleting rating:', error);
            throw error;
        }
    },

    getRatingByUserAndBook: async (userId, googleId) => {
        const query = `SELECT * FROM ratings WHERE user_id = ? AND book_id = ?`;
        try {
            const [bookResult] = await db.promise().query(
                "SELECT id FROM Books WHERE google_id = ? limit 1", [googleId]
            )
            const bookId = bookResult[0].id;
            const [rows] = await db.promise().query("SELECT * FROM ratings WHERE user_id = ? AND book_id = ?", [userId, bookId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Error fetching ratings:', error);
            throw error;
        }
    },

    getRatingByBookByUser: async (userId, googleId) => {
        try {
            const [bookResult] = await db.promise().query(
                "SELECT * FROM Books WHERE google_id = ? limit 1", [googleId]
            )
            const book = bookResult[0];

            const [ratingResult] = await db.promise().query(
                "SELECT r.id,r.book_id, r.rating, r.created_at, u.username FROM Ratings r " +
                "JOIN Users u ON r.user_id = u.id WHERE r.book_id = ? and u.id = ? ORDER BY r.created_at DESC",
                [book.id, userId]
            );
            const rating = ratingResult[0];

            return {book, rating};
        } catch (error) {
            console.error('Error fetching ratings:', error);
            throw error;
        }
    },

    getRatingsByBook: async (bookId) => {
        try {
            const [ratings] = await db.promise().query(`
            SELECT 
                r.rating, 
                r.review,  
                DATE_FORMAT(r.created_at, '%Y-%m-%d') as created_at, 
                u.username 
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.book_id = ?`, [bookId]);

            return ratings;
        } catch (error) {
            throw new Error('Failed to fetch ratings');
        }
    },

    editRating: async (userId, ratingId, rating, review) => {
        try {
            const [result] = await db.promise().query(
                "UPDATE Ratings SET rating = ?, review = ? WHERE book_id = ? AND user_id = ?",
                [rating, review, ratingId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating rating:', error);
            throw error;
        }
    }
}

module.exports = Rating;
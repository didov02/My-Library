const db = require('../db.js');

const Rating = {
    addRating: async (userId, bookId, rating) => {
        try {
            const [result] = await db.promise().query(
                "INSERT INTO Ratings (user_id, book_id, rating) VALUES (?, ?, ?)",
                [userId, bookId, rating]
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

    getAllRatingsByBook: async (googleId) => {
        try {
            const [bookId] = await db.promise().query(
                "SELECT id FROM Books WHERE google_id = ? limit 1", [googleId]
            )

            const [ratings] = await db.promise().query(
                "SELECT r.id, r.rating, r.created_at, u.username FROM Ratings r " +
                "JOIN Users u ON r.user_id = u.id WHERE r.book_id = ? ORDER BY r.created_at DESC",
                [bookId]
            );

            return ratings;
        } catch (error) {
            console.error('Error fetching ratings:', error);
            throw error;
        }
    },

    editRating: async (userId, ratingId, rating) => {
        try {
            const [result] = await db.promise().query(
                "UPDATE Ratings SET rating = ? WHERE id = ? AND user_id = ?",
                [rating, ratingId, userId]
            );
            return result.affectedRows > 0; // Returns true if a row was updated
        } catch (error) {
            console.error('Error updating rating:', error);
            throw error;
        }
    }
}

module.exports = Rating;
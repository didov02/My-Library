const db = require('../db.js');

const Comment = {
    writeComment: async (userId, bookId, comment) => {
        try {
            const [result] = await db.promise().query(
                "INSERT INTO Comments (user_id, book_id, comment) VALUES (?, ?, ?)",
                [userId, bookId, comment]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }

    },

    deleteComment: async (commentId, userId) => {
        try {
            const [result] = await db.promise().query(
                "DELETE FROM Comments WHERE id = ? AND user_id = ?",
                [commentId, userId]
            );
            return result.affectedRows > 0; // Returns true if a row was deleted
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    },

    editComment: async (commentId, userId, newComment) => {
        try {
            const [result] = await db.promise().query(
                "UPDATE Comments SET comment = ? WHERE id = ? AND user_id = ?",
                [newComment, commentId, userId]
            );
            return result.affectedRows > 0; // Returns true if a row was updated
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    },

    getAllCommentsByBook: async (bookId) => {
        try {
            const [comments] = await db.promise().query(
                "SELECT c.id, c.comment, c.created_at, u.username FROM Comments c " +
                "JOIN Users u ON c.user_id = u.id WHERE c.book_id = ? ORDER BY c.created_at DESC",
                [bookId]
            );
            return comments;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }

    }
}

module.exports = Comment;

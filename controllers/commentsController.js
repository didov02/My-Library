const Comment = require('../models/comment');

const commentController = {
    writeComment: async (req, res) => {
        const { userId, bookId, comment } = req.body;

        if (!userId || !bookId || !comment) {
            return res.status(400).json({ message: 'Missing required fields: userId, bookId, or comment.' });
        }

        try {
            const commentId = await Comment.addComment(userId, bookId, comment);
            res.status(201).json({ message: 'Comment added successfully.', commentId });
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ message: 'Failed to add comment.', error: error.message });
        }
    },

    deleteComment: async (req, res) => {
        const { userId } = req.body;
        const { commentId } = req.params;

        if (!commentId || !userId) {
            res.status(400).json({ message: 'Comment ID or User ID are missing'});
        }

        try {
            const deletedComment = await Comment.deleteComment(commentId, userId);
            if (deletedComment) {
                res.status(200).json({ message: 'Comment deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Comment not found or unauthorized.' });
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ message: 'Failed to delete comment.', error: error.message });
        }
    },

    editComment: async (req, res) => {
        const { userId, newComment } = req.body;
        const { commentId } = req.params;

        if (!commentId || !userId || !newComment) {
            return res.status(400).json({ message: 'Comment ID, User ID, and new comment text are required.' });
        }

        try {
            const updated = await Comment.updateComment(commentId, userId, newComment);
            if (updated) {
                res.status(200).json({ message: 'Comment updated successfully.' });
            } else {
                res.status(404).json({ message: 'Comment not found or unauthorized.' });
            }
        } catch (error) {
            console.error('Error updating comment:', error);
            res.status(500).json({ message: 'Failed to update comment.', error: error.message });
        }
    },

    getAllCommentsByBook: async (req, res) => {
        const { bookId } = req.params;

        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required.' });
        }

        try {
            const comments = await Comment.getCommentsByBookId(bookId);
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
            res.status(500).json({ message: 'Failed to fetch comments.', error: error.message });
        }
    }
}

module.exports = commentController;
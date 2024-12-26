const Rating = require('../models/rating');

const ratingController = {
    addRating: async (req, res) => {
        const { userId, bookId, rating } = req.body;

        if (!userId || !bookId || !rating) {
            return res.status(400).json({ message: 'Missing required fields: userId, bookId, or rating.' });
        }

        try {
            const ratingId = await Rating.addRating(userId, bookId, rating);
            res.status(201).json({ message: 'Rating added successfully.', ratingId });
        } catch (error) {
            console.error('Error adding rating:', error);
            res.status(500).json({ message: 'Failed to add rating.', error: error.message });
        }
    },

    deleteRating: async (req, res) => {
        const { ratingId } = req.params;
        const { userId } = req.body;

        if (!ratingId || !userId) {
            return res.status(400).json({ message: 'Rating ID and User ID are required.' });
        }

        try {
            const deleted = await Rating.deleteRating(ratingId, userId);
            if (deleted) {
                res.status(200).json({ message: 'Rating deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Rating not found or unauthorized.' });
            }
        } catch (error) {
            console.error('Error deleting rating:', error);
            res.status(500).json({ message: 'Failed to delete rating.', error: error.message });
        }
    },

    getAllRatingsByBook: async (req, res) => {
        const { bookId } = req.params;

        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required.' });
        }

        try {
            const ratings = await Rating.getRatingsByBookId(bookId);
            res.status(200).json(ratings);
        } catch (error) {
            console.error('Error fetching ratings:', error);
            res.status(500).json({ message: 'Failed to fetch ratings.', error: error.message });
        }
    },

    editRating: async (req, res) => {
        const { ratingId } = req.params;
        const { userId, rating } = req.body;

        if (!ratingId || !userId || !rating) {
            return res.status(400).json({ message: 'Rating ID, User ID, and new rating value are required.' });
        }

        try {
            const updated = await Rating.updateRating(ratingId, userId, rating);
            if (updated) {
                res.status(200).json({ message: 'Rating updated successfully.' });
            } else {
                res.status(404).json({ message: 'Rating not found or unauthorized.' });
            }
        } catch (error) {
            console.error('Error updating rating:', error);
            res.status(500).json({ message: 'Failed to update rating.', error: error.message });
        }
    },
}

module.exports = ratingController;
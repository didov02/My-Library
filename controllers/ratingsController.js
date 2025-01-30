const Rating = require('../models/rating');
const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Make edit work and showcase for all ratings per book

const ratingController = {
    addRating: async (req, res) => {
        const { bookId, rating, review } = req.body;

        if (!bookId || !rating) {
            return res.status(400).json({ message: 'Missing required fields: userId, bookId, or rating.' });
        }

        const token = req.cookies.token;

        try {
            const decoded = verify(token, JWT_SECRET);
            const userId = decoded.id;

            const ratingId = await Rating.addRating(userId, bookId, rating, review);
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

    getRatingForm: async (req, res) => {
        const { bookId } = req.params;
        const token = req.cookies.token;

        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required.' });
        }

        try {
            const decoded = verify(token, JWT_SECRET);
            const username = decoded.username;
            const userId = decoded.id;

            const {book, rating} = await Rating.getRatingByBookByUser(userId, bookId);

            const existingRating = await Rating.getRatingByUserAndBook(userId, bookId);
            if (existingRating) {
                res.render('books/editRating', {book: book, rating: rating, username: username});
            } else {
                res.render('books/addRating', {book: book, username: username});
            }
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
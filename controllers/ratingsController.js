const Rating = require('../models/rating');
const Book = require('../models/book');
const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Make edit work and showcase for all ratings per book

const ratingController = {
    addRating: async (req, res) => {
        const { googleBookId, bookId, rating, review } = req.body;

        if (!bookId || !rating) {
            return res.status(400).json({ message: 'Missing required fields: userId, bookId, or rating.' });
        }

        const token = req.cookies.token;

        try {
            const decoded = verify(token, JWT_SECRET);
            const userId = decoded.id;

            const ratingId = await Rating.addRating(userId, bookId, rating, review);
            res.redirect(`/ratings/view/${googleBookId}?success=true`);
        } catch (error) {
            console.error('Error adding rating:', error);
            res.status(500).json({ message: 'Failed to add rating.', error: error.message });
        }
    },

    deleteRating: async (req, res) => {
        const { ratingId } = req.params;
        const token = req.cookies.token;

        if (!ratingId) {
            return res.status(400).json({ message: 'Rating ID and User ID are required.' });
        }

        try {
            const decoded = verify(token, JWT_SECRET);
            const userId = decoded.id;
            const username = decoded.username;

            const deleted = await Rating.deleteRating(ratingId, userId);
            if (deleted) {
                return res.redirect(`/library/${username}`);
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
                res.render('books/editRating', {book: book, rating: rating, review: existingRating.review,
                    username: username, successMessage: null, googleBookId: bookId});
            } else {
                res.render('books/addRating', {book: book, username: username});
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
            res.status(500).json({ message: 'Failed to fetch ratings.', error: error.message });
        }
    },

    getAllRatingsByBook: async (req, res) => {
        const { bookId } = req.params;

        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required.' });
        }

        try {
            const ratings = await Rating.getRatingsByBook(bookId);
            const bookDetails = await Book.getBookDetailsFromDB(bookId);

            res.render('books/allRatings', { ratings: ratings, book: bookDetails });
        } catch (error) {
            console.error('Error fetching all ratings:', error);
            res.status(500).json({ message: 'Failed to fetch ratings.', error: error.message });
        }
    },

    editRating: async (req, res) => {
        const { bookId, ratingId, rating, review, googleBookId } = req.body;
        const token = req.cookies.token;

        if (!bookId || !rating) {
            return res.status(400).json({ message: 'Rating ID, User ID, and new rating value are required.' });
        }

        try {
            const decoded = verify(token, JWT_SECRET);
            const userId = decoded.id;
            const username = decoded.username;

            const {book} = await Rating.getRatingByBookByUser(userId, googleBookId);
            const updated = await Rating.editRating(userId, bookId , rating, review);
            if (updated) {
                res.render('books/editRating', {book: book, rating: rating, review: review,
                    username: username, successMessage: 'Rating updated successfully!', googleBookId: bookId});
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
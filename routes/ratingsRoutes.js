const express = require('express');
const ratingsController = require('../controllers/ratingsController');

const router = express.Router();

router.post('/add', ratingsController.addRating);

router.delete('/:ratingId', ratingsController.deleteRating);

router.get('/:bookId', ratingsController.getAllRatingsByBook);

router.put('/:ratingId', ratingsController.editRating);
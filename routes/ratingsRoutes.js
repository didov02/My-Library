const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController');

const authJWT = require('./middleware/authMiddleware');
router.use(authJWT);

router.post('/:bookId/add', ratingsController.addRating);

router.delete('/:bookId/:ratingId', ratingsController.deleteRating);

router.get('/:bookId', ratingsController.getAllRatingsByBook);

module.exports = router;
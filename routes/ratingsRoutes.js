const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController');

const authJWT = require('./middleware/authMiddleware');
router.use(authJWT);

router.post('/add', ratingsController.addRating);

router.delete('/:ratingId', ratingsController.deleteRating);

router.get('/:bookId', ratingsController.getAllRatingsByBook);

router.put('/:ratingId', ratingsController.editRating);

module.exports = router;
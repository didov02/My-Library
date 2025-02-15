const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController');

const authJWT = require('./middleware/authMiddleware');
router.use(authJWT);

router.get('/:bookId', ratingsController.getAllRatingsByBook);

router.get('/view/:bookId', ratingsController.getRatingForm);

router.post('/:bookId/add', ratingsController.addRating);

router.delete('/delete/:ratingId', ratingsController.deleteRating);

router.post('/edit/:ratingId/', ratingsController.editRating);

module.exports = router;
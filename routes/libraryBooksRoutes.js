const express = require('express');
const router = express.Router();
const libraryBookController = require('../controllers/libraryBooksController');

const authJWT = require('./middleware/authMiddleware');
router.use(authJWT);


router.post('/save', libraryBookController.saveBook);

router.delete('/:userId/:bookId', libraryBookController.deleteBook);

router.get('/:username', libraryBookController.getUserBooks);

module.exports = router;
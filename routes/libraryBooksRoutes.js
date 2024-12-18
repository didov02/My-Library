const express = require('express');
const router = express.Router();
const authJWT = require('./middleware/authMiddleware');
const libraryBooksController = require('../controllers/libraryBooksController');

router.use(authJWT);

router.get('/', libraryBooksController.getAllLibraryBooks);

router.put('/status', libraryBooksController.updateLibraryBook);

router.delete('/:bookId', libraryBooksController.removeBook);

module.exports = router;
const express = require('express');
const libraryBookController = require('../controllers/libraryBooksController');

const router = express.Router();

router.post('/save', libraryBookController.saveBook);

router.delete('/:userId/:bookId', libraryBookController.deleteBook);

module.exports = router;
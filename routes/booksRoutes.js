const express = require('express');
const booksController = require('../controllers/booksController');

const router = express.Router();
const authJWT = require('./middleware/authMiddleware');

router.use(authJWT);

router.get('/search', booksController.searchBook);

router.get('/:bookId', booksController.getBookDetails); 

router.post('/:bookId', booksController.saveBook);

module.exports = router;
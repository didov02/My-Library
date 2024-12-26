const express = require('express');
const booksController = require('../controllers/booksController');

const router = express.Router();
const authJWT = require('./middleware/authMiddleware');

router.use(authJWT);

router.get('/search', booksController.searchBook);

router.post('/save', booksController.saveBook);

module.exports = router;
const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const authJWT = require('./middleware/authMiddleware');
const indexPage = require('../controllers/indexController');

router.use(authJWT);

router.get('/', indexPage);

module.exports = router;
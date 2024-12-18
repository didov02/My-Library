const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Register user
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', usersController.register);

// Login user
router.post('/login', usersController.login);

router.get('/login', (req, res) => {
    res.render('users/login');
});

module.exports = router;
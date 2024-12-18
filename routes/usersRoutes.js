const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Register user
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', usersController.register);

// Login user
router.get('/login', (req, res) => {
    const message = req.query.message || '';
        res.render('users/login', { alertMessage : message });
});

router.post('/login', usersController.login);

router.post('/logout', usersController.logout);

router.get('/profile', usersController.viewProfile);

router.put('/profile', usersController.updateProfile);

module.exports = router;
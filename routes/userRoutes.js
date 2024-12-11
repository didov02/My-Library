const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');

// Register user
router.post('/register', usersController.registerUser);

// Login user
router.post('/login', usersController.loginUser);

module.exports = router;
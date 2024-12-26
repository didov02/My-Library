const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const usersController = require('../controllers/usersController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Set uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`); // Create a unique filename
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Optional: 5MB file size limit
    fileFilter: (req, file, cb) => {
        // Optional: Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
        } else {
            cb(null, true);
        }
    }
});

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

router.put('/profile', upload.single('profile_picture'), usersController.updateProfile);

module.exports = router;
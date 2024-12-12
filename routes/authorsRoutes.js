const express = require('express');
const authorsController = require('../controllers/authorsController');

const router = express.Router();

// Get all authors
router.get('/', authorsController.getAllAuthors);

// Get an author by ID
router.get('/:id', authorsController.getAuthorById);

// Add a new author
router.post('/', authorsController.addAuthor);

// Delete an author by ID
router.delete('/:id', authorsController.deleteAuthor);

module.exports = router;



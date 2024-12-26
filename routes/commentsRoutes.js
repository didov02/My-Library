const express = require('express');
const commentsController = require('../controllers/commentsController');

const router = express.Router();

router.post('/add', commentsController.writeComment);

router.get('/:bookId', commentsController.getAllCommentsByBook);

router.delete('/:commentId', commentsController.deleteComment);

router.put('/:commentId', commentsController.editComment);
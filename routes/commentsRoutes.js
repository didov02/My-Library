const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

const authJWT = require('./middleware/authMiddleware');
router.use(authJWT);

router.post('/add', commentsController.writeComment);

router.get('/:bookId', commentsController.getAllCommentsByBook);

router.delete('/:commentId', commentsController.deleteComment);

router.put('/:commentId', commentsController.editComment);

module.exports = router;

const express = require('express');
const router = express.Router();
const authJWT = require('./middleware/authMiddleware');

router.use(authJWT);

module.exports = router;

const commentsController = require('../controllers/commentsController');


router.post('/add', commentsController.writeComment);

router.get('/:bookId', commentsController.getAllCommentsByBook);

router.delete('/:commentId', commentsController.deleteComment);

router.put('/:commentId', commentsController.editComment);


module.exports = router;


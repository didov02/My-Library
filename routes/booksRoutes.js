const express = require('express');
const router = express.Router();
const authJWT = require('./middleware/authMiddleware');

router.use(authJWT);

module.exports = router;
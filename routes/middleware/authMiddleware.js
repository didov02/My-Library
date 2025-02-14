const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authJWT = (req, res, next) => {
    if (req.path === '/users/login' || req.path === '/users/register') {
        return next();
    }

    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/users/login?message=' + encodeURIComponent('Please log in to continue.'));
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
}

module.exports = authJWT;
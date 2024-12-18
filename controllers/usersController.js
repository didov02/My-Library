const db = require('../db.js');
const User = require("../models/user");
const {verify} = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const usersController = {
    register: async (req, res) => {
        const {username, email, password} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({error: "All fields are required"});
        }

        try {
            const result = await User.registerUser(username, email, password);
            res.status(201).json({message: "User registered successfully"});
        } catch (err) {
            res.status(500).json({error: "Failed to register user"});
        }
    },

    login: async (req, res) => {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({error: "All fields are required"});
        }

        try {
            const user = await User.authenticateUser(username, password);
            if (!user) {
                return res.status(400).json({error: "Invalid username or password"});
            }

            // Generate JWT Token
            const token = User.generateToken(user);

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            //res.redirect('/library/');
            res.redirect('/');
        } catch (err) {
            res.status(500).json({error: "Failed to login"});
        }
    },

    logout: (req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        res.redirect('/users/login');
    },

    viewProfile: async (req, res) => {
        const token = req.cookies.token || '';

        if(!token) {
            return res.status(401).json({error: 'Not authenticated'});
        }

        try {
            const decoded = verify(token, JWT_SECRET);
            const username = decoded.username;
            const email = decoded.email;

            const query = 'SELECT * FROM Users Where username = ? AND email = ?';
            const [user] = await db.promise().query(query, [username, email]);

            if (user.length === 0) {
                return res.status(404).json({error: 'User not found'});
            }

            const userData = user[0];
            res.render('users/profile', {user: userData});
        } catch (err) {
            res.status(500).json({error: 'Failed to retrieve profile'});
        }
    },

    updateProfile: async (req, res) => {
        const token = req.cookies.token || '';

        if(!token) {
            return res.status(401).json({error: 'Not authenticated'});
        }

        try {
            const decoded = verify(token, JWT_SECRET);
            const oldUsername = decoded.username;
            const oldEmail = decoded.email;

            const { newUsername, newEmail } = req.body;
            const profilePicture = req.file ? req.file.filename : null;

            let query = 'UPDATE Users SET';
            let queryParams = [];

            if (newUsername) {
                query += ' username = ?';
                queryParams.push(newUsername);
            }

            if (newEmail) {
                query += queryParams.length ? ', email = ?' : ' email = ?';
                queryParams.push(newEmail);
            }

            if (profilePicture) {
                query += queryParams.length ? ', profile_picture = ?' : ' profile_picture = ?';
                queryParams.push(profilePicture);
            }

            query += 'WHERE username = ? AND email = ?';
            queryParams.push(oldUsername, oldEmail);
            await db.promise().query(query, queryParams);

            res.redirect('/users/profile');
        } catch {
            res.status(500).json({error: "Failed to update profile"});
        }
    }
}

module.exports = usersController;
const db = require("../db.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const User = {
    registerUser: async (username, password) => {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save the user in the database
            const query = 'INSERT INTO Users (username, password) VALUES (?, ?)';
            const [result] = await db.execute(query, [username, hashedPassword]);
            return result;
        } catch (err) {
            console.error("Error during user registration:", err);
            throw new Error("Failed to register user");
        }
    },

    authenticateUser: async (username, password) => {
        try {
            const query = 'SELECT * FROM Users WHERE username = ?';
            const [rows] = await db.execute(query, [username]);

            if (rows.length === 0) {
                return null;
            }

            // Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, rows[0].password);

            if (isPasswordValid) {
                return rows[0];  // Return the user object
            }
            return null;
        } catch (err) {
            console.error("Error during user authentication:", err);
            throw new Error("Failed to authenticate user");
        }
    },

    generateToken: (user) => {
        return jwt.sign({id: user.id, username: user.username}, JWT_SECRET, {
            expiresIn: '1h' // Token expires in 1 hour
        });
    }
}

module.exports = User;

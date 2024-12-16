const db = require("../db.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const User = {
    registerUser: async (username, email, password) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const query = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
            const result = await db.execute(query, [username, email, hashedPassword]);
            return result;
        } catch (err) {
            throw new Error("Failed to register user");
        }
    },

    authenticateUser: (username, password) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Users WHERE username = ?';

            db.query(query, [username], (err, rows) => {
                if (err) {
                    return reject(new Error('Database query failed'));
                }

                if (rows.length === 0) {
                    return resolve(null);
                }

                const user = rows[0];

                bcrypt.compare(password, user.password, (compareErr, isPasswordValid) => {
                    if (compareErr) {
                        return reject(new Error('Password comparison failed'));
                    }

                    if (isPasswordValid) {
                        return resolve({ username: user.username, email: user.email });
                    } else {
                        console.log('Invalid password');
                        return resolve(null);
                    }
                });
            });
        });
    },

    generateToken: (user) => {
        return jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, {
            expiresIn: '1h'
        });
    }
}

module.exports = User;

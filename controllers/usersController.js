const User = require("../models/user");

const usersController = {
    register: async (req, res) => {
        const {username, email, password} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        try {
            const result = await User.registerUser(username, email, password);
            res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
            res.status(500).json({ error: "Failed to register user" });
        }
    },

    login: async (req, res) => {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        try {
            const user = await User.authenticateUser(username, password);
            if (!user) {
                return res.status(400).json({ error: "Invalid username or password" });
            }

            // Generate JWT Token
            const token = User.generateToken(user);
            res.status(200).json({ message: "Login successful", token });
        } catch (err) {
            res.status(500).json({ error: "Failed to login" });
        }
    }
}

module.exports = usersController;
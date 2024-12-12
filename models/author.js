const db = require("../db.js");

const Author = {
    getAllAuthors: async () => {
        const query = 'SELECT * FROM authors';
        try {
            const [rows] = await db.promise().query(query);
            return rows;
        } catch (err) {
            throw new Error('Failed to fetch authors: ' + err.message);
        }
    },

    getAuthorById: async (id) => {
        const query = 'SELECT * FROM authors WHERE id = ?';
        try {
            const [rows] = await db.promise().query(query);
            return rows[0];
        } catch (err) {
            throw new Error('Failed to fetch author: ' + err.message);
        }
    },

    addAuthor: async (author) => {
        const query = 'Insert into authors (name, bio) values (?, ?)';
        try {
            const [result] = await db.promise().query(query, [author.name, author.bio]);
            return result;
        } catch (err) {
            throw new Error('Failed to add author: ' + err.message);
        }
    },

    // Delete an author by ID
    deleteAuthor: async (id) => {
        const query = 'DELETE FROM Authors WHERE id = ?';
        try {
            const [result] = await db.promise().query(query, [id]);
            return result;
        } catch (err) {
            throw new Error('Failed to delete author: ' + err.message);
        }
    }
}

module.exports = Author;
const Author = require('../models/author');

const authorsController = {
    getAllAuthors: async (req, res) => {
        try {
            const authors = await Author.getAllAuthors();
            res.json(authors);
        } catch (err) {
            res.status(500).json({error: 'Failed to fetch authors'});
        }
    },

    getAuthorById: async (req, res) => {
        const id = req.params.id;
        try {
            const author = await Author.getAuthorById(id);
            if (!author) {
                return res.status(404).json({error: 'No author with this id'});
            }
        } catch (err) {
            res.status(500).json({error: 'Failed to fetch author'});
        }
    },

    addAuthor: async (req, res) => {
        const {name, bio} = req.body;
        try {
            const newAuthor = await Author.addAuthor({name, bio});
            res.status(201).json(newAuthor);
        } catch (err) {
            res.status(500).json({error: 'Failed to add author'});
        }
    },

    deleteAuthor: async (req, res) => {
        const id = req.params.id;

        try {
            const result = await Author.deleteAuthor(id);
            if (result.affectedRows = 0) {
                return res.status(404).json({error: 'Author not found'});
            }
            return res.status(200).json({message: 'Author successfully deleted'});
        } catch (err) {
            res.status(500).json({error: 'Failed to delete author'});
        }
    }
}

module.exports = authorsController;
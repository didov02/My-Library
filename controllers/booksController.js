const Book = require('../models/book');
const db = require('../db')

const booksController = {
    searchBook: async (req, res) => {
        const { query } = req.query; 
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        try {
            const books = await Book.searchBook(query);
            res.render('books/search', { query, results: books});
        } catch (err) {
            console.error('Error searching for books:', err);
            res.status(500).json({ error: 'Failed to fetch books' , details: err.message});
        }
    },

    saveBook: async (req, res) => {
        const book = req.body;
        const username = req.user.username;

        if (!book || !book.id) {
            return res.status(400).json({ error: 'Valid book data is required' });
        }

        try {
            const book = {
                google_id: req.body.id,
                title: req.body.title,
                authors: req.body.authors.split(", "),
                genre: req.body.genre.split(", "),
                year_of_publication: req.body.year_of_publication,
                description: req.body.description,
                cover_image: req.body.cover_image,
            }
            const [userResult] = await db.promise().query("SELECT id FROM Users WHERE username = ?", [username]);
            if (userResult.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const userId = userResult[0].id;
    
            const [exists] = await db.promise().query(
                "SELECT * FROM LibraryBooks WHERE user_id = ? AND google_id = ?",
                [userId, book.id]
            );
    
            if (exists.length > 0) {
                return res.status(200).json({ message: 'You already have this book in your library.' });
            }
    
            await Book.saveBook(book, username);
    
            return res.status(201).json({ message: 'Book successfully added to your library.' });

        } catch (err) {
            console.error('Error saving the book:', err);
            res.status(500).json({ error: 'Failed to save the book' });
        }
    },

    getBookDetails: async (req, res) => {
        const { bookId } = req.params;
        const { query } = req.query.query || "";

        try {
            const bookDetails = await Book.getBookDetails(bookId);

            if (!bookDetails) {
                return res.status(404).json({ error: 'Book not found' });
            }

            res.render('books/details', { book: bookDetails, query: query });
        } catch (err) {
            console.error('Error fetching book details:', err);
            res.status(500).json({ error: 'Failed to fetch book details', details: err.message });
        }
    },
};

module.exports = booksController;
const Book = require('../models/book');
const db = require('../db');

const booksController = {
    searchBook: async (req, res) => {
        const {query} = req.query;
        const page = parseInt(req.query.page) || 1;
        const maxResults = 10;
 
        if (!query) {
            return res.status(400).json({error: 'Search query is required'});
        }

        try {
            const { books, totalItems } = await Book.searchBook(query, page, maxResults);
            const totalPages = Math.ceil(totalItems / maxResults);
            res.render('books/search', {query, results: books, currentPage: page, totalPages});
        } catch (err) {
            console.error('Error searching for books:', err);
            res.status(500).json({error: 'Failed to fetch books', details: err.message});
        }
    },

    saveBook: async (req, res) => {
        const googleIdFromRoute = req.params.bookId;
        const book = req.body;
        const username = req.user.username;

        if (!book) {
            return res.status(400).json({error: 'Valid book data is required'});
        }

        if (!book.google_id) {
            book.google_id = googleIdFromRoute;
        }

        try {
            const book = {
                google_id: req.body.google_id,
                title: req.body.title,
                authors: req.body.authors.split(", "),
                genre: req.body.genre.split(", "),
                year_of_publication: req.body.year_of_publication,
                description: req.body.description,
                cover_image: req.body.cover_image,
            }
            const [userResult] = await db.promise().query("SELECT id FROM Users WHERE username = ?", [username]);
            if (userResult.length === 0) {
                return res.status(404).json({message: 'User not found'});
            }

            const userId = userResult[0].id;

            const [exists] = await db.promise().query(
                "SELECT * FROM LibraryBooks WHERE user_id = ? AND book_id = ?",
                [userId, book.google_id]
            );

            if (exists.length > 0) {
                return res.status(200).json({message: 'You already have this book in your library.'});
            }

            await Book.saveBook(book, username);

            const message = 'Book successfully added to your library!';
            return res.redirect(`/library/${username}`);
        } catch (err) {
            console.error('Error saving the book:', err);
            const message = 'Failed to save the book. Please try again.';
            return res.redirect(`/books/${googleIdFromRoute}`);
        }
    },

    getBookDetails: async (req, res) => {
        const {bookId} = req.params;
        const {query} = req.query || "";

        try {
            const bookDetails = await Book.getBookDetails(bookId);

            if (!bookDetails) {
                return res.status(404).json({error: 'Book not found'});
            }

            res.render('books/details', {book: bookDetails, query: query});
        } catch (err) {
            console.error('Error fetching book details:', err);
            res.status(500).json({error: 'Failed to fetch book details', details: err.message});
        }
    },
};

module.exports = booksController;
const db = require("../db.js");
const axios = require('axios');

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = 'AIzaSyA5dGCpvQZTZFJ4AYfamPO29QBIC4KANTA';

const Book = {
    searchBook: async (query) => {
        try {
            const response = await axios.get(GOOGLE_BOOKS_API_URL, {
                params: {
                    q: query,
                    key: API_KEY,
                },
            });
    
            const apiBooks = response.data.items.map(item => ({
                id: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors || [],
                genre: item.volumeInfo.categories || [],
                year_of_publication: item.volumeInfo.publishedDate || '',
                description: item.volumeInfo.description || '',
                cover_image: item.volumeInfo.imageLinks?.thumbnail || ''
            }));
    
            console.log('Books found in Google Books API:', apiBooks);
    
            return apiBooks;
        } catch (error) {
            console.error('Error fetching books from Google Books API:', error);
            throw error;
        }
    },

    saveBook: async (book) => {
        const [exists] = await db.promise().query("SELECT id FROM Books WHERE id = ?", [book.id]);
        if (exists.length === 0) {
            await db.promise().query(
                "INSERT INTO Books (id, title, author_id, genre, year_of_publication, description, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    book.id,
                    book.title,
                    book.authors.join(', '),
                    book.genre.join(', '),
                    book.year_of_publication,
                    book.description,
                    book.cover_image
                ]
            );
        }
    }
}
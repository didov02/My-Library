document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results-container");

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();

        if (!query) {
            alert("Please enter a search query.");
            return;
        }

        try {
            const response = await fetch(`/books/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch search results");
            }

            const results = await response.json();
            displayResults(results);
        } catch (error) {
            console.error("Error fetching search results:", error);
            alert("An error occurred while searching. Please try again later.");
        }
    });


    function displayResults(results) {
        resultsContainer.innerHTML = "";

        if (!results || results.length === 0) {
            resultsContainer.innerHTML = "<p>No books found.</p>";
            return;
        }

        results.forEach((book) => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");

            bookCard.innerHTML = `
                <img src="${book.cover_image || 'placeholder.jpg'}" alt="${book.title}" />
                <h3>${book.title}</h3>
                <p>Author: ${book.authors || 'Unknown'}</p>
                <p>Genre: ${book.genre || 'Unknown'}</p>
                <button class="btn btn-primary" onclick="addToLibrary('${book.id}')">Add to Library</button>
            `;

            resultsContainer.appendChild(bookCard);
        });
    }

    async function addToLibrary(bookId) {
        try {
            const response = await fetch("/library", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookId, status: "want_to_read" }),
            });

            if (!response.ok) {
                throw new Error("Failed to add book to library");
            }

            const result = await response.json();
            alert(result.message || "Book added to library!");
        } catch (error) {
            console.error("Error adding book to library:", error);
            alert("An error occurred while adding the book. Please try again.");
        }
    }
});

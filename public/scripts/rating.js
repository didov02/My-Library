console.log("Ratings page script loaded.");

const currentBookId = window.currentBookId;

const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const socket = new WebSocket(wsProtocol + '://' + window.location.host);

socket.onopen = (event) => {
  console.log('WebSocket connection established.');
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};

socket.onmessage = (event) => {
  console.log('WebSocket message received:', event.data);
  const data = JSON.parse(event.data);

  if (data.bookId != currentBookId) {
    return;
  }

  switch (data.action) {
    case 'add': {
      const ratingsList = document.querySelector('.ratings-list');
      if (ratingsList) {
        const newRatingItem = document.createElement('div');
        newRatingItem.className = 'rating-item';
        newRatingItem.id = 'rating-' + data.ratingId;
        newRatingItem.innerHTML = `
          <p><strong>User:</strong> ${data.username}</p>
          <p><strong>Rating:</strong> ${data.rating} / 5</p>
          <p><strong>Review:</strong> ${data.review}</p>
          <p><strong>Created At:</strong> ${new Date(data.createdAt).toLocaleDateString()}</p>
          <hr>
        `;
        ratingsList.appendChild(newRatingItem);
      }
      break;
    }
    case 'edit': {
      const ratingItem = document.getElementById('rating-' + data.ratingId);
      if (ratingItem) {
        ratingItem.innerHTML = `
          <p><strong>User:</strong> ${data.username}</p>
          <p><strong>Rating:</strong> ${data.rating} / 5</p>
          <p><strong>Review:</strong> ${data.review}</p>
          <p><strong>Updated At:</strong> ${new Date(data.updatedAt).toLocaleDateString()}</p>
          <hr>
        `;
      }
      break;
    }
    case 'delete': {
      const ratingItem = document.getElementById('rating-' + data.ratingId);

      if (ratingItem) {
        ratingItem.remove();
        console.log('Rating ' + data.ratingId + ' removed from DOM.');
      }

      const ratingsList = document.querySelector('.ratings-list');
      if (ratingsList && ratingsList.children.length === 0) {
        ratingsList.innerHTML = "<p>No ratings for this book yet.</p>";
      }

      break;
    }
    default:
      console.warn('Unknown action:', data.action);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.getElementById('reviews-container');

  // Display each review
  const displayReview = (review) => {
    const reviewCard = document.createElement('div');
    reviewCard.classList.add('review-card');
    reviewCard.innerHTML = `
      <h3>Game Name: ${review.gameName}</h3>
      <p>Review: ${review.review1}</p>
      <p>ID: ${review.id}</p>
      <button class="delete-btn" data-id="${review.id}">Delete</button>
    `;
    reviewsContainer.appendChild(reviewCard);
  };

  // Fetch and display all reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:8000/reviews');
      const reviews = await response.json();
      reviewsContainer.innerHTML = '';
      reviews.forEach((review) => {
        displayReview(review);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Delete a review
  const deleteReview = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/reviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Review with ID ${id} deleted successfully`);
        fetchReviews();
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Event listener for delete buttons
  reviewsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const reviewId = event.target.dataset.id;
      deleteReview(reviewId);
    }
  });

  // Fetch and display reviews on page load
  fetchReviews();
});

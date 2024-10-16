// Function to generate random reviews
function generateReviews() {
  const reviews = [];
  const totalSpots = 20;
  const totalUsers = 44;

  for (let spotId = 1; spotId <= totalSpots; spotId++) {
    // Generate a random number of reviews (0 to 5)
    const numberOfReviews = Math.floor(Math.random() * 6);

    for (let i = 0; i < numberOfReviews; i++) {
      const userId = Math.floor(Math.random() * totalUsers) + 1; // User ID between 1 and 45
      const stars = Math.floor(Math.random() * 5) + 1; // Stars between 1 and 5
      const reviewText = `This is a review for spot ${spotId}. It was a ${stars}-star experience. I really enjoyed the atmosphere and would recommend it to others.`;

      reviews.push({
        spotId,
        userId,
        review: reviewText,
        stars,
      });
    }
  }

  return reviews;
}

// Generate the reviews
const reviewsArray = generateReviews();
console.log(reviewsArray);

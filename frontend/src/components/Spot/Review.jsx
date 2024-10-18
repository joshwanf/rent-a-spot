import { ReviewItem } from "./ReviewItem";

import "../../css/Review.css";
/**
 * @param {object} props
 * @param {App.ReviewSlice[]} props.reviews
 * @param {App.RootState['session']['user']} props.user
 * @param {number} props.ownerId
 */
export const Review = ({ reviews, user, ownerId }) => {
  if (user && user.id !== ownerId && reviews.length === 0) {
    return <div>Be the first to leave a review!</div>;
  }
  return (
    <div>
      {reviews.toReversed().map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

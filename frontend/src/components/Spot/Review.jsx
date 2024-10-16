import { ReviewItem } from "./ReviewItem";
/**
 * @param {object} props
 * @param {App.ReviewsBySpotIdAPI['Reviews']} props.reviews
 * @param {App.RootState['review']['spotReviews']} props.reviews_old
 * @param {App.RootState['session']['user']} props.user
 * @param {number} props.ownerId
 */
export const Review = ({ reviews, user, ownerId }) => {
  if (user && user.id !== ownerId && reviews.length === 0) {
    return <div>Be the first to leave a review!</div>;
  }
  return (
    <div>
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

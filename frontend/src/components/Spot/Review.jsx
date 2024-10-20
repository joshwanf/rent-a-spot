import { ReviewItem } from "./ReviewItem";
import { useAppSelector } from "../../store";
import { useParams } from "react-router-dom";

import "../../css/Review.css";
/**
 * @param {object} props
 * @param {number[]} props.reviews
 * @param {number} props.ownerId
 */
export const Review = ({ ownerId }) => {
  const { spotId } = useParams();
  const loggedInUserOrNull = useAppSelector((state) => state.session.user);
  const allReviews = useAppSelector((state) =>
    Object.values(state.reviews)
      .filter((review) => review.spotId === Number(spotId))
      .map((review) => review.id)
  );
  if (
    loggedInUserOrNull &&
    loggedInUserOrNull.id !== ownerId &&
    allReviews.length === 0
  ) {
    return <div>Be the first to leave a review!</div>;
  }
  return (
    <div data-testid="review-list">
      {allReviews.toReversed().map((review) => (
        <ReviewItem key={review} reviewId={review} />
      ))}
    </div>
  );
};

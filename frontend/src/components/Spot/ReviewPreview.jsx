import { StarRating } from "./StarRating";
/**
 *
 * @param {object} props
 * @param {number} props.numReviews
 * @param {number} props.rating
 * @returns {JSX.Element}
 */
export const ReviewSummary = ({ numReviews, rating }) => {
  const reviewsText = numReviews === 1 ? "Review" : "Reviews";
  return (
    <div className="spot-review-summary">
      <StarRating rating={rating} />
      {numReviews !== 0 && (
        <div className="spot-review">
          <span style={{ padding: "0px 0.25em" }}>&middot;</span>
          {numReviews} {reviewsText}
        </div>
      )}
    </div>
  );
};

import { StarRating } from "./StarRating";

/** @type {(props: {numReviews: number, rating: string}) => JSX.Element} */
export const ReviewSummary = ({ numReviews, rating }) => {
  // if (!numReviews) return <h1>no reviews</h1>;
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

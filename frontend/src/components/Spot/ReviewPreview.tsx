import { StarRating } from "./StarRating";

interface Props {
  numReviews: number;
  rating: number;
}

export const ReviewSummary = ({ numReviews, rating }: Props) => {
  // if (!numReviews) return <h1>no reviews</h1>;
  // console.log("num reviews and type", numReviews, typeof numReviews);
  const reviewsText = numReviews === 1 ? "Review" : "Reviews";
  return (
    <div className="spot-review-summary">
      <StarRating rating={rating} />
      {numReviews !== 0 && (
        <div className="spot-review">
          <p>
            <span style={{ padding: "0px 0.25em" }}>&middot;</span>
            <span data-testid="review-count">
              {numReviews} {reviewsText}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

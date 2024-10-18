/**
 * @param {object} props
 * @param {App.ReviewSlice} props.review
 */
export const ReviewItem = ({ review }) => {
  // if (!review) return <div>No Reviews!</div>;
  const reviewDate = new Date(review.createdAt);
  return (
    <div className="review-item">
      <div>{review.user.firstName}</div>
      <div>
        {reviewDate.toLocaleString("default", { month: "long" })}{" "}
        {reviewDate.getFullYear()}
      </div>
      <div>{review.review}</div>
    </div>
  );
};

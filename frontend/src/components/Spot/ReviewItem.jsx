/**
 * @param {object} props
 * @param {App.ReviewAPI} props.review
 */
export const ReviewItem = ({ review }) => {
  // if (!review) return <div>No Reviews!</div>;
  const reviewDate = new Date(review.createdAt);
  return (
    <div className="review">
      <div>{review.User.firstName}</div>
      <div>
        {reviewDate.toLocaleString("default", { month: "long" })}{" "}
        {reviewDate.getFullYear()}
      </div>
      <div>{review.review}</div>
    </div>
  );
};

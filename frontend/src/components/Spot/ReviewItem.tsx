import { useAppSelector } from "../../store";
import { DeleteOpenModalButton } from "./DeleteOpenModalButton";
import { DeleteSpotOrReviewModal } from "./DeleteSpotOrReviewModal";

interface Props {
  reviewId: number;
}

export const ReviewItem = ({ reviewId }: Props) => {
  const currentUser = useAppSelector((state) => state.session.user);
  const review = useAppSelector((state) => state.reviews[reviewId]);
  const reviewUser = useAppSelector((state) => state.users[review.userId]);
  if (!review) {
    return <div>This review doesn&apos;t exist!</div>;
  }

  const reviewDate = new Date(review.createdAt);
  if (!reviewUser) {
    return <div>This review doesn&apos;t have a user!</div>;
  }

  return (
    <div className="review-item" data-testid="review-item">
      <div>{reviewUser.firstName}</div>
      <div data-testid="review-date">
        {reviewDate.toLocaleString("default", { month: "long" })}{" "}
        {reviewDate.getFullYear()}
      </div>
      <div data-testid="review-text">{review.review}</div>
      {currentUser && currentUser.id === review.userId && (
        <DeleteOpenModalButton
          modalComponent={
            <DeleteSpotOrReviewModal
              resourceType="Review"
              resourceId={review.id}
              spotId={review.spotId}
            />
          }
          className="review-delete-button"
          buttonText="Delete"
        />
      )}
    </div>
  );
};

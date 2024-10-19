import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getOneSpot } from "../../store";
import { getReviewsBySpotThunk } from "../../store";
import {
  useAppSelector,
  useAppDispatch,
  selectSession,
  selectOneSpot,
  selectReviewsBySpotId,
} from "../../store";

import { Price } from "./Price";
import { ReviewSummary } from "./ReviewPreview";
import { SpotDetailImages } from "./SpotDetailImages";
import { Review } from "./Review";
import { CreateReview } from "./CreateReview";
import OpenModalButton from "../OpenModalButton";

import "../../css/SpotDetail.css";

export const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useAppDispatch();
  const [isLoadedSpotAndReviews, setIsLoadedSpotAndReviews] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(getOneSpot(Number(spotId)));
      await dispatch(getReviewsBySpotThunk(Number(spotId)));
      setIsLoadedSpotAndReviews(true);
    })();
  }, [dispatch, spotId, setIsLoadedSpotAndReviews]);

  const spot = useAppSelector(selectOneSpot(Number(spotId)));
  const spotOwner = useAppSelector((state) => state.users[spot?.ownerId]);
  const thisUser = useAppSelector(selectSession);
  // const thisReviews = useAppSelector(selectReviewsBySpotId(Number(spotId)));
  const thisReviews = useAppSelector((state) =>
    Object.values(state.reviews)
  ).filter((review) => review.spotId === Number(spotId));
  // .map((review) => review.id);

  if (!isLoadedSpotAndReviews || !spot) {
    return <div>Loading spot...</div>;
  }

  const spotImages = {
    preview: spot.previewImg,
    regular: spot.regularImgs,
  };

  const userHasReviewForSpot =
    thisUser &&
    thisReviews.filter((review) => review.userId === thisUser.id).length > 0;
  console.log("spotdetail", { thisReviews });
  const canPostReview =
    thisUser && thisUser.id !== spot.ownerId && !userHasReviewForSpot;
  // const spotImages = [
  //   spot.previewImageUrl,
  //   // spot.images.preview.url,
  //   ...spot.images.regular.map((img) => img.url),
  // ];

  /**
   * @param {React.MouseEvent<HTMLElement>} e
   * @returns {void}
   */
  const handleReserveBooking = (e) => {
    e.preventDefault();
    alert("Feature coming soon");
  };

  /** @type {(e: React.MouseEvent<HTMLElement>) => void} */
  const handlePostReview = (e) => {
    e.preventDefault();
  };

  const handleAfterPostReview = async () => {
    await dispatch(getOneSpot(spotId));
  };

  return (
    <div>
      <h2>{spot.name}</h2>
      <div>
        {spot.city}, {spot.state}, {spot.country}
      </div>
      <SpotDetailImages images={spotImages} spotId={spot.id} />
      <div className="spot-detail">
        <div className="spot-detail-info">
          <div>
            Hosted by {spotOwner?.firstName} {spotOwner?.lastName}
          </div>
          <div>{spot.description}</div>
        </div>
        <div className="spot-detail-book">
          <Price price={spot.price} />
          <ReviewSummary rating={spot.rating} numReviews={spot.numReviews} />
          <button
            onClick={handleReserveBooking}
            className="spot-detail-book-btn"
          >
            Reserve
          </button>
        </div>
      </div>
      <hr />
      <div>
        <ReviewSummary numReviews={spot.numReviews} rating={spot.rating} />
      </div>
      <div>
        {canPostReview && (
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<CreateReview spotId={spot.id} />}
            onButtonClick={() => {}}
            onModalClose={handleAfterPostReview}
          />
        )}
      </div>
      {
        <Review
          reviews={thisReviews.map((review) => review.id)}
          ownerId={spot.ownerId}
        />
      }
    </div>
  );
};

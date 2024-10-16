import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { getOneSpot } from "../../store";
import { getReviewsBySpot } from "../../store";
import { useAppSelector, useAppDispatch } from "../../store";

import { Price } from "./Price";
import { ReviewSummary } from "./ReviewPreview";
import { SpotDetailImages } from "./SpotDetailImages";
import { Review } from "./Review";

import "../../css/SpotDetail.css";

export const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useAppDispatch();

  const thisUser = useAppSelector((state) => state.session.user);
  const spot = useAppSelector((state) => state.spot.CurrentSpot);

  // /** @type {App.SpotImage} */
  // const spotImages = spot.SpotImages;

  // /** @type {App.ReviewsBySpotIdAPI['Reviews']} */
  // const spotReviews = useAppSelector((state) =>
  //   Object.values(state.review.spotReviews)
  // ).filter((review) => review.spotId === Number(spotId));

  // const sortedReviews = spotReviews.sort(
  //   (prev, next) => prev.createdAt < next.createdAt
  // );

  const thisReviews = useAppSelector((state) =>
    Object.values(state.review.spotReviews)
  );

  console.log("thisReviews", { thisReviews });

  useEffect(() => {
    console.log("in use effect");
    (async () => {
      await dispatch(getOneSpot(spotId));
      await dispatch(getReviewsBySpot(spotId));
    })();
  }, [dispatch, spotId]);

  /**
   *
   * @param {React.MouseEvent<HTMLElement>} e
   * @returns {void}
   */
  const handleReserveBooking = (e) => {
    e.preventDefault();
    alert("Feature coming soon");
  };
  return (
    <div>
      {spot?.id && (
        <>
          <h2>{spot.name}</h2>
          <div>
            {spot.city}, {spot.state}, {spot.country}
          </div>
          <SpotDetailImages images={spot.SpotImages} />
          <div className="spot-detail">
            <div className="spot-detail-info">
              <div>
                Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
              </div>
              <div>{spot.description}</div>
            </div>
            <div className="spot-detail-book">
              <Price price={spot.price} />
              <ReviewSummary
                numReviews={spot.numReviews}
                rating={spot.avgStarRating}
              />
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
            <ReviewSummary
              numReviews={spot.numReviews}
              rating={spot.avgStarRating}
            />
          </div>
          {
            <Review
              reviews={thisReviews}
              user={thisUser}
              ownerId={spot.Owner.id}
            />
          }
        </>
      )}
    </div>
  );
};

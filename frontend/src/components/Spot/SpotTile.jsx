import { useNavigate } from "react-router-dom";
import { StarRating } from "./StarRating";
import { Price } from "./Price";
import { DeleteSpotOrReviewModal } from "./DeleteSpotOrReviewModal";
import { DeleteOpenModalButton } from "./DeleteOpenModalButton";

/**
 * @param {object} props
 * @param {Store.State.Spots} props.spot
 * @param {boolean} props.showDashboard
 * @returns {JSX.Element}
 */
export const SpotTile = ({ spot, showDashboard }) => {
  const navigate = useNavigate();

  /** @type {(spotId: number) => () => void} */
  const handleClickSpotDetails = (spotId) => () => {
    navigate(`/spots/${spotId}`);
  };

  /** @type {(spotId: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void} */
  const handleClickUpdate = (spotId) => (e) => {
    e.stopPropagation();
    navigate(`/spots/${spotId}/edit`);
  };

  // /** @type {(spotId: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void} */
  // const handleClickDelete = (spotId) => async (e) => {
  //   e.stopPropagation();
  //   // const deleteRes = await dispatch(deleteOneSpotThunk(spotId));
  // };

  return (
    <div
      className="spot-tile"
      title={spot.name}
      onClick={handleClickSpotDetails(spot.id)}
    >
      <img
        src={`spot-images/${spot.id}/${spot.previewImageUrl}`}
        className="spotImg"
      />
      <div className="spot-tile-details">
        <div>
          {spot.city}, {spot.state}
        </div>
        <StarRating rating={spot.rating} />
      </div>
      <Price price={spot.price} />
      {showDashboard && (
        <div className="spot-tile-controls">
          <button onClick={handleClickUpdate(spot.id)}>Update</button>
          <DeleteOpenModalButton
            buttonText="Delete"
            modalComponent={
              <DeleteSpotOrReviewModal
                resourceId={spot.id}
                resourceType="Spot"
              />
            }
          />
        </div>
      )}
    </div>
  );
};

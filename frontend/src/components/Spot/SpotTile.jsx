import { useNavigate } from "react-router-dom";
import { StarRating } from "./StarRating";
import { Price } from "./Price";
import { DeleteSpotOrReviewModal } from "./DeleteSpotOrReviewModal";
import { DeleteOpenModalButton } from "./DeleteOpenModalButton";
import "../../css/SpotTile.css";

/**
 * @param {object} props
 * @param {Store.State.Spots} props.spot
 * @param {boolean} props.showDashboard
 * @returns {JSX.Element}
 */
export const SpotTile = ({ spot, showDashboard }) => {
  const navigate = useNavigate();

  /** @type {(spotId: number) => (e) => void} */
  const handleClickSpotDetails = (spotId) => () => {
    // e.target.href = `/spots/${spotId}`;
    navigate(`/spots/${spotId}`);
  };

  /** @type {(spotId: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void} */
  const handleClickUpdate = (spotId) => (e) => {
    e.stopPropagation();
    navigate(`/spots/${spotId}/edit`);
  };
  // const tileLinkToDetails = `/spots/${spot.id}`;
  // /** @type {(spotId: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void} */
  // const handleClickDelete = (spotId) => async (e) => {
  //   e.stopPropagation();
  //   // const deleteRes = await dispatch(deleteOneSpotThunk(spotId));
  // };

  return (
    <div
      onClick={handleClickSpotDetails(spot.id)}
      data-testid="spot-tile"
      className="spot-tile2"
      href={`/spots/${spot.id}`}
    >
      <div data-testid="spot-tooltip" title={spot.name} className="spot-tile">
        <div data-testid="spot-link">
          {/* <Link to={tileLinkToDetails} data-testid="spot-link"> */}
          <img
            src={`${spot.previewImageUrl}`}
            className="spotImg"
            data-testid="spot-thumbnail-image"
          />
          <div className="spot-tile-details">
            <div className="spot-tile-location">
              <span data-testid="spot-city">{spot.city}</span>, {spot.state}
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
        {/* </Link> */}
      </div>
    </div>
  );
};

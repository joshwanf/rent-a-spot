import { useNavigate } from "react-router-dom";
import { StarRating } from "./StarRating";
import { Price } from "./Price";

/**
 * @param {object} props
 * @param {App.SpotSlice} props.spot
 * @returns {JSX.Element}
 */
export const SpotTile = ({ spot }) => {
  const navigate = useNavigate();

  /**
   * @param {number} spotId
   * @returns
   */
  const handleClick = (spotId) => () => {
    navigate(`/spots/${spotId}`);
  };
  return (
    <div className="spot-tile" title={spot.name} onClick={handleClick(spot.id)}>
      <img
        src={`spot-images/${spot.id}/${spot.images.preview.url}`}
        className="spotImg"
      />
      <div className="spot-tile-details">
        <div>
          {spot.city}, {spot.state}
        </div>
        <StarRating rating={spot.avgRating} />
      </div>
      <Price price={spot.price} />
    </div>
  );
};

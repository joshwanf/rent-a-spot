import { useNavigate } from "react-router-dom";
import { StarRating } from "./StarRating";
import { Price } from "./Price";

/** @typedef {import('../../store').AllSpotsState['Spots'][*]} Spot */

/**
 *
 * @param {object} props
 * @param {Spot} props.spot
 * @returns {JSX.Element}
 */
export const SpotTile = ({ spot }) => {
  const navigate = useNavigate();
  const handleClick = (spotId) => () => {
    navigate(`/spots/${spotId}`);
  };
  return (
    <div className="spot-tile" title={spot.name} onClick={handleClick(spot.id)}>
      <img
        src={`spot-images/${spot.id}/${spot.previewImage}`}
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

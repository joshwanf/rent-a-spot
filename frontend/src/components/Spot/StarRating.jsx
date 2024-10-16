import { IoIosStar } from "react-icons/io";

/**
 * @param {Object} props
 * @param {number} props.rating
 */
export const StarRating = ({ rating }) => {
  return (
    <div className="spot-rating">
      <IoIosStar /> {rating ? rating : "New"}
    </div>
  );
};

import { IoIosStar } from "react-icons/io";

/**
 * @param {Object} props
 * @param {number} props.rating
 */
export const StarRating = ({ rating }) => {
  return (
    <div className="spot-rating">
      <IoIosStar />{" "}
      {typeof rating === "number" && Number(rating) !== 0
        ? rating.toFixed(1)
        : "New"}
    </div>
  );
};

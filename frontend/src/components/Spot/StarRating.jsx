import { IoIosStar } from "react-icons/io";

/** @type {(props: {rating: string}) => JSX.Element} */
export const StarRating = ({ rating }) => {
  return (
    <div className="spot-rating">
      <IoIosStar /> {rating}
    </div>
  );
};

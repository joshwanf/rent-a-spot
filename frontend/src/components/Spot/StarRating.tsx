import { IoIosStar } from "react-icons/io";

interface Props {
  rating: number;
}

export const StarRating = ({ rating }: Props) => {
  return (
    <div className="spot-rating" data-testid="spot-rating">
      <IoIosStar /> {rating}
    </div>
  );
};

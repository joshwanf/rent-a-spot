import { useState } from "react";
import { selectSession, useAppDispatch } from "../../store";
/**
 * @param {object} props
 * @prop {number} userId
 * @returns {JSX.Element}
 */
export const ManageSpots = ({ userId }) => {
  const dispatch = useAppDispatch();
  const [isLoadedSpots, setIsLoadedSpots] = useState(false);
  useEffect(() => {
    async () => {
      await dispatch(gotCurrentSpots(userId));
    };
  });
};

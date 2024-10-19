import { useState, useEffect } from "react";
import {
  useAppSelector,
  useAppDispatch,
  selectAllSpots,
  selectAllSpotsArr,
  selectSession,
  getAllSpots,
} from "../../store";
import { SpotTile } from "./SpotTile";
import "../../css/AllSpots.css";

export const AllSpots = () => {
  const dispatch = useAppDispatch();
  const [isLoadedUser, setIsLoadedUser] = useState(false);
  const [isLoadedSpots, setIsLoadedSpots] = useState(false);
  const user = useAppSelector(selectSession);
  const spots = useAppSelector(selectAllSpotsArr);

  useEffect(() => {
    (() => {
      // dispatch(restoreUser()).then(() => setIsLoadedUser(true));
      dispatch(getAllSpots()).then(() => setIsLoadedSpots(true));
    })();
  }, [dispatch, setIsLoadedUser, setIsLoadedSpots]);

  // const spots = Object.values(useAppSelector(selectAllSpots));

  //   const [isLoadedSpots, setIsLoadedSpots] = useState(false);
  //   useEffect(() => {
  //     (async () => {
  //       dispatch(getAllSpots());
  //       setIsLoadedSpots(true);
  //     })();
  //   }, [dispatch]);

  if (!spots) {
    return <div className="all-spots">Loading all spots...</div>;
  }

  return (
    <div className="all-spots">
      {spots.toReversed().map((spot) => (
        <SpotTile key={spot.id} spot={spot} showDashboard={false} />
      ))}
    </div>
  );
};

import { useState, useEffect } from "react";
import {
  selectSession,
  useAppDispatch,
  useAppSelector,
  selectSpotsByUser,
  getAllSpots,
} from "../../store";
import { SpotTile } from "./SpotTile";
/**
 * @returns {JSX.Element}
 */
export const ManageSpots = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectSession);

  const userSpots = useAppSelector(selectSpotsByUser(user?.id));

  useEffect(() => {
    (async () => {
      if (user) {
        await dispatch(getAllSpots(user.id));
        // setIsLoadedSpots(true);
      }
    })();
  }, [dispatch]);

  if (!user || !userSpots) {
    return <div>Loading user's current spots...</div>;
  }
  return (
    <>
      <div>
        <h1>Manage Spots</h1>
      </div>
      {userSpots.length > 0 ? (
        <div className="allSpots">
          {userSpots.map((spot) => (
            <SpotTile key={spot.id} spot={spot} showDashboard={true} />
          ))}
        </div>
      ) : (
        <a href="/spots/new">Create a New Spot</a>
      )}
    </>
  );
};

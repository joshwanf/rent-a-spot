import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getAllSpots } from "../../store";
import { SpotTile } from "./SpotTile";
import "../../css/AllSpots.css";

/** @typedef {import('../../store').AllSpotsState} AllSpotsState */

export const AllSpots = () => {
  const dispatch = useDispatch();
  //   const [isLoadedSpots, setIsLoadedSpots] = useState(false);

  /** @type {AllSpotsState['Spots']} */
  //   const spotsArr = Object.values(spots);
  const spots = Object.values(useSelector((state) => state.spot.AllSpots));

  //   useEffect(() => {
  //     (async () => {
  //       dispatch(getAllSpots());
  //       setIsLoadedSpots(true);
  //     })();
  //   }, [dispatch]);

  return (
    <div className="allSpots">
      {spots.map((spot) => (
        <SpotTile key={spot.id} spot={spot} />
      ))}
    </div>
  );
};

import { useAppSelector } from "../../store";
import { SpotTile } from "./SpotTile";
import "../../css/AllSpots.css";

/** @typedef {import('../../store').AllSpotsState} AllSpotsState */

export const AllSpots = () => {
  //   const [isLoadedSpots, setIsLoadedSpots] = useState(false);

  /** @type {AllSpotsState['Spots']} */
  //   const spotsArr = Object.values(spots);
  const spots = Object.values(useAppSelector((state) => state.spot.AllSpots));

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

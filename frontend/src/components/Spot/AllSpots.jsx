import { useAppSelector, selectAllSpots } from "../../store";
import { SpotTile } from "./SpotTile";
import "../../css/AllSpots.css";

export const AllSpots = () => {
  const spots = Object.values(useAppSelector(selectAllSpots));

  //   const [isLoadedSpots, setIsLoadedSpots] = useState(false);
  //   useEffect(() => {
  //     (async () => {
  //       dispatch(getAllSpots());
  //       setIsLoadedSpots(true);
  //     })();
  //   }, [dispatch]);
  if (!spots) {
    return <div className="allSpots">Loading all spots...</div>;
  }
  return (
    <div className="allSpots">
      {spots.reverse().map((spot) => (
        <SpotTile key={spot.id} spot={spot} />
      ))}
    </div>
  );
};

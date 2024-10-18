import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { useAppDispatch, selectAllSpots, getAllSpots } from "./store";

import { Navigation } from "./components/Navigation";
import { restoreUser } from "./store";
import { CreateSpot } from "./components/Spot/CreateSpot";
import { AllSpots } from "./components/Spot/AllSpots";
import { SpotDetail } from "./components/Spot/SpotDetail";
import { ManageSpots } from "./components/Spot/ManageSpots";

const Layout = () => {
  const dispatch = useAppDispatch();
  const [isLoadedUser, setIsLoadedUser] = useState(false);
  const [isLoadedSpots, setIsLoadedSpots] = useState(false);

  useEffect(() => {
    (() => {
      dispatch(restoreUser()).then(() => {
        setIsLoadedUser(true);
      });
      dispatch(getAllSpots()).then(() => setIsLoadedSpots(true));
    })();
  }, [dispatch]);

  return (
    <>
      <Navigation />
      {isLoadedUser && isLoadedSpots && <Outlet />}
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <AllSpots /> },
      {
        path: "spots",
        children: [
          { path: ":spotId", element: <SpotDetail /> },
          { path: "new", element: <CreateSpot /> },
          { path: "current", element: <ManageSpots /> },
          { path: "", element: <h2>spots parent</h2> },
        ],
      },
    ],
  },
  { path: "*", element: <h1>Uh oh!</h1> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

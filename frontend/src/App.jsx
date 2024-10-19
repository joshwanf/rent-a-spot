import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { useAppDispatch } from "./store";

import { Navigation } from "./components/Navigation";
import { restoreUser } from "./store";
import { AllSpots } from "./components/Spot/AllSpots";
import { SpotDetail } from "./components/Spot/SpotDetail";
import { ManageSpots } from "./components/Spot/ManageSpots";
import { CreateSpot } from "./components/Spot/CreateSpot";
import { EditSpot } from "./components/Spot/EditSpot";

import "./css/App.css";

const Layout = () => {
  const dispatch = useAppDispatch();
  const [isLoadedUser, setIsLoadedUser] = useState(false);
  // const [isLoadedSpots, setIsLoadedSpots] = useState(false);

  useEffect(() => {
    (() => {
      dispatch(restoreUser()).then(() => setIsLoadedUser(true));
      // dispatch(getAllSpots()).then(() => setIsLoadedSpots(true));
    })();
  }, [dispatch, setIsLoadedUser]);

  return (
    <>
      <Navigation />
      {isLoadedUser && <Outlet />}
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
          {
            path: ":spotId",
            // element: <SpotDetail />,
            children: [
              { path: "", element: <SpotDetail /> },
              { path: "edit", element: <EditSpot /> },
              { path: "*", element: <h1>Uh oh!</h1> },
            ],
          },
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

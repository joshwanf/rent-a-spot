import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Navigation } from "./components/Navigation";

import { restoreUser } from "./store";

const Layout = () => {
  const dispatch = useDispatch();
  const [isLoadedUser, setIsLoadedUser] = useState(false);

  useEffect(() => {
    (() => {
      dispatch(restoreUser()).then((r) => {
        setIsLoadedUser(true);
      });
    })();
  }, [dispatch]);

  return (
    <>
      <h1>Hello from App</h1>
      <nav>
        <Navigation />
      </nav>
      {isLoadedUser && <Outlet />}
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [{ path: "/", element: <h1>hello</h1> }],
  },
  { path: "*", element: <h1>Uh oh!</h1> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

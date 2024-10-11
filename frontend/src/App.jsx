import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  NavLink,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import { LoginFormPage } from "./components/LoginFormPage";
import { SignupFormPage } from "./components/SignupFormPage";

import { restoreUser } from "./store";

const Layout = () => {
  const dispatch = useDispatch();
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    (() => {
      dispatch(restoreUser()).then((r) => {
        setIsUserLoaded(Boolean(r.user));
      });
    })();
  }, [dispatch]);

  // if (!isUserLoaded) {
  //   return <h1>Must be logged in!</h1>;
  // }

  return (
    <>
      <h1>Hello from App</h1>
      <nav>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Sign up</NavLink>
      </nav>
      {isUserLoaded && <Outlet />}
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [],
  },
  {
    path: "/login",
    element: <LoginFormPage />,
  },
  { path: "/signup", element: <SignupFormPage /> },
  { path: "*", element: <h1>Uh oh!</h1> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import { ProfileButton } from "./ProfileButton";

export const Navigation = () => {
  const session = useSelector((state) => state.session);

  return (
    <div>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        {!session.user && (
          <li>
            <NavLink to="/login">Log in</NavLink>
          </li>
        )}
        {!session.user && (
          <li>
            <NavLink to="/signup">Sign up</NavLink>
          </li>
        )}
      </ul>
      {session.user && <ProfileButton user={session.user} />}
    </div>
  );
};

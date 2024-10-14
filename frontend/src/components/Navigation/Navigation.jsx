import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import OpenModalButton from "../OpenModalButton";
import { LoginFormModal } from "../LoginFormModal";
import { SignupFormModal } from "../SignupFormModal";
import { ProfileButton } from "./ProfileButton";

export const Navigation = () => {
  const session = useSelector((state) => state.session);

  return (
    <div>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        {session && (
          <li>
            <ProfileButton user={session.user} />
          </li>
        )}
      </ul>
    </div>
  );
};

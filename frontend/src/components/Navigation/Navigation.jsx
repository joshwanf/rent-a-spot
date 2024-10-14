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
        {!session.user && (
          <li>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
        )}
        {!session.user && (
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
        )}
      </ul>
      {session.user && <ProfileButton user={session.user} />}
    </div>
  );
};

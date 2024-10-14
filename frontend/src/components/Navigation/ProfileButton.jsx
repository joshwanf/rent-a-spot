import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { VscAccount } from "react-icons/vsc";

import { logoutUser } from "../../store";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { LoginFormModal } from "../LoginFormModal";
import { SignupFormModal } from "../SignupFormModal";

import "../../css/ProfileButton.css";

/** @typedef {import('../../store').SessionState} SessionState */

/**
 * @param {SessionState} Param0.user
 */
export const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const profileRef = useRef();

  const handleToggleProfile = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!profileRef.current.contains(e.target)) {
        // console.log("window clicked");
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    closeMenu();
  };
  return (
    <div className="profile-button">
      <div className="profile-icon" onClick={handleToggleProfile}>
        <VscAccount size="5em" />
      </div>
      <div ref={profileRef} className={showMenu ? "" : "hidden"}>
        {!user ? (
          <ul>
            <OpenModalMenuItem
              itemText="Log In"
              modalComponent={<LoginFormModal />}
              onItemClick={closeMenu}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              modalComponent={<SignupFormModal />}
              onItemClick={{ closeMenu }}
            />
          </ul>
        ) : (
          <ul>
            <li>{user.username}</li>
            <li>{`${user.firstName} ${user.lastName}`}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={handleLogout} className="logout">
                Log out
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

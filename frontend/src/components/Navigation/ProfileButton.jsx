import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { VscAccount } from "react-icons/vsc";

import { logoutUser } from "../../store";

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

    const closeProfile = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        console.log("window clicked");
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeProfile);
    return () => document.removeEventListener("click", closeProfile);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };
  return (
    <div className="profile-button">
      <div className="profile-icon" onClick={handleToggleProfile}>
        <VscAccount size="5em" />
      </div>
      <div ref={profileRef} className={showMenu ? "" : "hidden"}>
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
      </div>
    </div>
  );
};

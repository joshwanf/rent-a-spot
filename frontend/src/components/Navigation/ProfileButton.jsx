import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";

import { useAppDispatch, logoutUser } from "../../store";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { LoginFormModal } from "../LoginFormModal";
import { SignupFormModal } from "../SignupFormModal";

import "../../css/ProfileButton.css";

/**
 * @param {App.RootState['session']} props.user
 */
export const ProfileButton = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  /** @type {React.MutableRefObject<HTMLUListElement | null>} */
  const profileRef = useRef(null);

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

  const handleLogout = () => {
    // e.preventDefault();
    dispatch(logoutUser());
    closeMenu();
    navigate("/");
  };
  return (
    <div
      className="profile-button"
      style={{ float: "right" }}
      data-testid="user-menu-button"
    >
      <div className="profile-icon" onClick={handleToggleProfile}>
        <RxHamburgerMenu />
        <VscAccount />
      </div>
      <div
        ref={profileRef}
        className={`profile-menu ${showMenu ? "" : "hidden"}`}
        data-testid="user-dropdown-menu"
      >
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
              onItemClick={closeMenu}
            />
          </ul>
        ) : (
          <div>
            <div>Hello, {user.username}</div>
            <div>{user.email}</div>
            <div>
              <Link to="/spots/current" onClick={() => closeMenu()}>
                Manage Spots
              </Link>
            </div>
            <div>
              <button onClick={handleLogout} className="logout">
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

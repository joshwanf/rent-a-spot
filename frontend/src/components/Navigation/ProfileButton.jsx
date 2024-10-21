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
 * @param {Store.API.User} props.user
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
    <div className="profile-button" style={{ float: "right" }}>
      <div
        className="profile-icon"
        onClick={handleToggleProfile}
        data-testid="user-menu-button"
      >
        <RxHamburgerMenu />
        <VscAccount />
      </div>
      <div
        ref={profileRef}
        className={`profile-menu ${showMenu ? "" : "hidden"}`}
      >
        {!user ? (
          <div data-testid="user-dropdown-menu">
            <div>
              <OpenModalMenuItem
                itemText="Sign Up"
                modalComponent={<SignupFormModal />}
                onItemClick={closeMenu}
              />
            </div>
            <div>
              <OpenModalMenuItem
                itemText="Log in"
                modalComponent={<LoginFormModal />}
                onItemClick={closeMenu}
              />
            </div>
          </div>
        ) : (
          <div>
            <div data-testid="user-dropdown-menu">
              <div>Hello, {user.firstName}</div>
              <div>{user.email}</div>
            </div>
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

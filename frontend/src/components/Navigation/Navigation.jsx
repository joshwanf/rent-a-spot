import { NavLink, useNavigate } from "react-router-dom";
import { FaAirbnb } from "react-icons/fa6";

import { useAppSelector } from "../../store";
import { ProfileButton } from "./ProfileButton";

import "../../css/Navigation.css";

export const Navigation = () => {
  const navigate = useNavigate();
  const session = useAppSelector((state) => state.session);

  const handleClick = () => {
    navigate("/spots/new");
  };
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/" className="nav-link">
            <FaAirbnb data-testid="logo" />
            <span>Rent a Spot</span>
          </NavLink>
        </li>
        <li className="nav-link-profile">
          {session.user && (
            <button
              onClick={handleClick}
              id="create-spot-btn"
              data-testid="create-new-spot-button"
            >
              Create a New Spot
            </button>
          )}
          <ProfileButton user={session.user} />
        </li>
      </ul>
    </nav>
  );
};

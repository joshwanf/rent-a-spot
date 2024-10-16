import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaAirbnb } from "react-icons/fa6";

import { ProfileButton } from "./ProfileButton";

import "../../css/Navigation.css";

export const Navigation = () => {
  const session = useSelector((state) => state.session);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/">
            <FaAirbnb />
            Home
          </NavLink>
        </li>
        <li>
          <ProfileButton user={session.user} />
        </li>
      </ul>
    </nav>
  );
};

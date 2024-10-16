import { NavLink } from "react-router-dom";
import { FaAirbnb } from "react-icons/fa6";

import { useAppSelector } from "../../store";
import { ProfileButton } from "./ProfileButton";

import "../../css/Navigation.css";

export const Navigation = () => {
  const session = useAppSelector((state) => state.session);

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

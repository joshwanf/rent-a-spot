import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Error } from "./Error";
import { signupUser } from "../store";

export const SignupFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setUser({ ...user, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (user.password !== user.confirmPassword) {
      return setErrors({ confirmPassword: "Passwords must match!" });
    }

    const response = await dispatch(signupUser(user));
    if (response?.errors) {
      setErrors(response.errors);
    } else if (response?.ok) {
      navigate("/");
    }
  };
  return (
    <div>
      <Error errors={errors} />
      <form onSubmit={handleSubmit}>
        <div>
          <label className="login-form-item">
            <div>First name</div>
            <input
              onChange={handleChange("firstName")}
              defaultValue={user.firstName}
              placeholder="First name"
              name="firstName"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Last name</div>
            <input
              onChange={handleChange("lastName")}
              defaultValue={user.lastName}
              placeholder="Last name"
              name="lastName"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Email</div>
            <input
              onChange={handleChange("email")}
              defaultValue={user.email}
              placeholder="Email"
              name="email"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Username</div>
            <input
              onChange={handleChange("username")}
              defaultValue={user.username}
              placeholder="Username"
              name="username"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Password</div>
            <input
              onChange={handleChange("password")}
              defaultValue={user.password}
              placeholder="Password"
              name="password"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Confirm password</div>
            <input
              onChange={handleChange("confirmPassword")}
              defaultValue={user.confirmPassword}
              placeholder="Confirm password"
              name="confirmPassword"
              type="text"
            />
          </label>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

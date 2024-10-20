import { useState } from "react";

import { useModal } from "../context/Modal";
import { Error } from "./Error";
import { signupUser } from "../store";
import { useAppDispatch } from "../store";

import "../css/SignupFormModal.css";

export const SignupFormModal = () => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isDisabledSubmit =
    Object.values(user).some((value) => value.length === 0) ||
    user.username.length < 4 ||
    user.password.length < 6;

  /**
   * @param {string} field
   * @returns {(e: React.ChangeEvent<HTMLInputElement>) => void}
   */
  const handleChange = (field) => (e) => {
    setUser({ ...user, [field]: e.currentTarget.value });
  };

  /**
   * @param {React.FormEvent<HTMLFormElement>} e
   * @returns {Promise<any>}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (
      !user.password ||
      !user.confirmPassword ||
      user.password !== user.confirmPassword
    ) {
      return setErrors({ confirmPassword: "Passwords must match!" });
    }

    const response = await dispatch(signupUser(user));
    if (response.type === "error") {
      const error = await response.error.json();
      console.log(error);
      return setErrors(error);
    } else if (response.type === "signup") {
      const user = response.signup.json();
      closeModal();
      return user;
    }
  };

  /** @type {Record<string, string>} */
  const dataIdTagsForTesting = {
    firstName: "firstname-error-message",
    lastName: "lastname-error-message",
    username: "username-error-message",
    password: "password-error-message",
    confirmPassword: "confirmpassword-error-message",
    email: "email-error-message",
  };
  console.log("errors", { errors });
  return (
    <div className="signup-form" data-testid="sign-up-form">
      {/* <Error errors=" " testId="username-error-message" /> */}
      {/* {errors && <div data-testid="username-error-message"></div>} */}
      {["email", "username"].map((field) => {
        if (errors[field]) {
          return (
            <Error
              key={field}
              errors={errors[field]}
              testId={dataIdTagsForTesting[field]}
            />
          );
        } else {
          return;
        }
      })}
      {/* <Error errors={errors.email} testId="email-error-message" />
      )} */}
      <form onSubmit={handleSubmit}>
        <div>
          <label className="login-form-item">
            <div>First Name</div>
            <input
              onChange={handleChange("firstName")}
              defaultValue={user.firstName}
              placeholder="First Name"
              name="firstName"
              type="text"
              data-testid="first-name-input"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Last Name</div>
            <input
              onChange={handleChange("lastName")}
              defaultValue={user.lastName}
              placeholder="Last Name"
              name="lastName"
              type="text"
              data-testid="last-name-input"
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
              data-testid="email-input"
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
              data-testid="username-input"
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
              data-testid="password-input"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Confirm Password</div>
            <input
              onChange={handleChange("confirmPassword")}
              defaultValue={user.confirmPassword}
              placeholder="Confirm Password"
              name="confirmPassword"
              type="text"
              data-testid="confirm-password-input"
            />
          </label>
        </div>
        <div className="sign-up-button">
          <button disabled={isDisabledSubmit} data-testid="form-sign-up-button">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

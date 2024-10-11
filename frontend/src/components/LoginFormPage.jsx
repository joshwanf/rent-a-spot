import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";

import { loginUser } from "../store";
import { Error } from "./Error";

import "../css/LoginFormPage.css";

/** @typedef {import('../store').SessionState} SessionState */

export const LoginFormPage = () => {
  const dispatch = useDispatch();

  /** @type {SessionState} */
  const loggedInUser = useSelector((state) => state.session);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  if (loggedInUser.user !== null) {
    return <Navigate to="/" replace={true} />;
  }

  const handleChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const response = await dispatch(loginUser({ credential, password }));
    if (response?.errors) {
      setErrors(response.errors);
    }
  };

  return (
    <div className="login-form">
      <Error errors={errors} />
      <form onSubmit={handleSubmit}>
        <div>
          <label className="login-form-item">
            <div>Username/email</div>
            <input
              onChange={handleChange(setCredential)}
              defaultValue={credential}
              placeholder="Username/email"
              name="credential"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Password</div>
            <input
              onChange={handleChange(setPassword)}
              placeholder="Password"
              defaultValue={password}
              name="password"
              type="password"
            />
          </label>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};

import { useState } from "react";
import { useDispatch } from "react-redux";

import { loginUser, logInDemoUser } from "../store";
import { useModal } from "../context/Modal";
import { Error } from "./Error";

import "../css/LoginFormModal.css";

/** @typedef {import('../store').SessionState} SessionState */

export const LoginFormModal = () => {
  const dispatch = useDispatch();
  // const [loginUser, setLoginUser] = useState({
  //   credential: "",
  //   password: "",
  // });
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isDisabledSubmit = credential.length < 4 || password.length < 6;

  const handleChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const response = await dispatch(loginUser({ credential, password }));
    if (response?.errors) {
      setErrors(response.errors);
    } else {
      closeModal();
    }
  };

  const handleLogInDemo = async (e) => {
    e.preventDefault();
    setErrors({});
    const response = await dispatch(logInDemoUser());
    if (response?.errors) {
      setErrors(response.errors);
    } else {
      closeModal();
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
        <button disabled={isDisabledSubmit}>Submit</button>
      </form>
      <button onClick={handleLogInDemo}>Log in Demo User</button>
    </div>
  );
};

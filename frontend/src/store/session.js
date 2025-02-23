import { csrfFetch } from "./csrf";

// All actions specific to the session user's information and session user's Redux reducer

const SET_USER = "session/addSession";
const REMOVE_USER = "session/removeSession";
// const LOG_IN_DEMO_USER = "session/logInDemoUser";

// Action creators

export const setUser = (user) => ({ type: SET_USER, user });
export const removeUser = () => ({ type: REMOVE_USER });

// Thunk action creators
export const loginUser = (user) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential: user.credential,
        password: user.password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    dispatch({ type: "users/setUsers", payload: [data.user] });
    return response;
  } catch (err) {
    const error = await err.json();
    return error;
  }
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  if (data.user !== null) {
    dispatch(setUser(data.user));
    dispatch({ type: "users/setUsers", payload: [data.user] });
  }
  return data;
};

export const signupUser = (user) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (data.user !== null) {
      dispatch(setUser(data.user));
      dispatch({ type: "users/setUsers", payload: [data.user] });
      return { type: "signup", signup: data };
    } else {
      return { type: "error", error: "Couldn't sign up user!" };
    }
  } catch (err) {
    // console.log("in signUpUser", err);
    return { type: "error", error: err };
    // const error = await err.json();
    // return error;
  }
};

export const logoutUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", { method: "DELETE" });
  dispatch(removeUser());
  return response;
};

export const logInDemoUser = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential: "demo@user.io",
        password: "password",
      }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    dispatch({ type: "users/setUsers", payload: [data.user] });
    return response;
  } catch (err) {
    const error = await err.json();
    return error;
  }
};
// Reducers

/**
 *
 * @param {App.RootState['session']} state
 * @param {*} action
 * @returns
 */
const sessionReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, user: action.user };
    }
    case REMOVE_USER: {
      return { ...state, user: null };
    }
    default: {
      return state;
    }
  }
};
export default sessionReducer;

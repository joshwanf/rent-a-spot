import { csrfFetch } from "./csrf";

// All actions specific to the session user's information and session user's Redux reducer

/**
 * @typedef {Object} RootState
 * @property {{
 * id: number
 * email: string,
 * username: string,
 * firstName: string,
 * lastName: string
 * }} user
 */

/**
 * @typedef {Array<RootState>} RootStateArray
 */

const SET_USER = "session/addSession";
const REMOVE_USER = "session/removeSession";
// const LOGIN_SESSION = "session/logInSession";

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
    return response;
  } catch (err) {
    const error = await err.json();
    return error;
    // console.log({ error });
  }

  // console.log({ response });
  // if (response.ok) {
  // } else {
  //   return "uh oh";
  // }
  // csrfFetch("/api/session", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     credential: user.credential,
  //     password: user.password,
  //   }),
  // })
  //   .then((r) => r.json())
  //   .then((r) => {
  //     console.log(r);
  //   })
  //   .catch((e) => e.json())
  //   .then((e) => console.log(e));
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  if (data.user !== null) {
    dispatch(setUser(data.user));
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
    }
    return response;
  } catch (err) {
    const error = await err.json();
    return error;
  }
};

// Reducers

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

const SET_USERS = "users/setUsers";

export const usersReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_USERS: {
      /** @type {Store.State.Session['AllUsers']} */
      const newUsers = {};
      for (const user of action.payload) {
        newUsers[user.id] = { ...user };
      }
      return { ...state, ...newUsers };
    }
    default:
      return state;
  }
};

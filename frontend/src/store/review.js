import { csrfFetch } from "./csrf";

const SET_SPOT_REVIEWS = "review/setSpotReview";
// Action creators
const setSpotReview = (reviews) => {
  return { type: SET_SPOT_REVIEWS, reviews };
};

// Thunks
export const getReviewsBySpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    dispatch(setSpotReview(data.Reviews));
    return data;
  } catch (err) {
    const error = await err.json();
    return error;
  }
};

// Reducer
/**
 * @type {{ spotReviews: Array<App.ReviewAPINorm> }}
 */
const initialState = {
  spotReviews: {},
};

/**
 *
 * @param {initialState} state
 * @param {{ type: string, reviews: Array<App.ReviewAPINorm }} action
 * @returns
 */
const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOT_REVIEWS: {
      const newState = { ...state, spotReviews: {} };
      for (const review of action.reviews) {
        newState.spotReviews[review.id] = review;
      }
      return newState;
    }
    default:
      return state;
  }
};
export default reviewReducer;

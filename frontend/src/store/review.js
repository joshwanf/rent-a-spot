import { csrfFetch } from "./csrf";
import { getOneSpot } from "./spot";
const SET_SPOT_REVIEWS = "review/setSpotReview";
const GOT_SPOT_REVIEWS = "review/gotSpotReviews";
const CREATED_REVIEW = "review/createdReview";

// Action creators

/** @type {(reviews: App.ReviewsBySpotIdAPI) => App.GotReviewsBySpotIdAction} */
const setSpotReview = (reviews) => {
  return { type: GOT_SPOT_REVIEWS, reviews };
};

/** @type {(prop: {review: App.CreateReviewBySpotIdAPI, userInfo: App.User}) => App.CreatedReviewBySpotIdAction} */
const createSpotReview = ({ review, userInfo }) => {
  return { type: CREATED_REVIEW, payload: { review, userInfo } };
};

// Thunks
export const getReviewsBySpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    dispatch(setSpotReview(data));
    return data;
  } catch (err) {
    const error = await err.json();
    return error;
  }
};

/**
 * @typedef {Object} CreateReviewDetails
 * @prop {{review: string, stars: number}} reviewDetails
 * @prop {number} spotId
 * @prop {App.User | null} userInfo
 * @param {CreateReviewDetails} details
 * @returns {(dispatch) => Promise<{type: "review", review: App.Review} | {type: "error", error: App.CreateReviewError}>}
 */
export const createReviewThunk =
  ({ reviewDetails, spotId, userInfo }) =>
  async (dispatch) => {
    try {
      const createReviewResponse = await csrfFetch(
        `/api/spots/${spotId}/reviews`,
        {
          method: "POST",
          body: JSON.stringify(reviewDetails),
        }
      );
      const review = await createReviewResponse.json();
      console.log("52452314", { review });
      await dispatch(createSpotReview({ review, userInfo }));
      //   await dispatch(getReviewsBySpot(spotId));
      await dispatch(getOneSpot(spotId));

      return { type: "review", review };
    } catch (err) {
      const error = await err.json();
      return { type: "error", error };
    }
  };

// Reducer

/**
 * @param {App.RootState['reviews']} state
 * @param {App.GotReviewsBySpotIdAction | App.CreatedReviewBySpotIdAction} action
 * @return {App.RootState['reviews']}
 */
const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case GOT_SPOT_REVIEWS: {
      /** @type {App.RootState['reviews']} */
      const reviews = {};
      for (const review of action.reviews.Reviews) {
        const { User, ReviewImages, ...rest } = review;
        reviews[review.id] = {
          ...rest,
          user: { ...User },
          images: [...ReviewImages],
        };
      }
      return {
        ...state,
        ...reviews,
      };
    }
    case CREATED_REVIEW: {
      console.log("@@@#$@#$@", action.payload.review.id);
      /** @type {App.ReviewSlice} */
      const newReview = {
        ...action.payload.review,
        user: { ...action.payload.userInfo },
        images: [],
      };

      return {
        ...state,
        [action.payload.review.id]: newReview,
      };
    }
    default:
      return state;
  }
};
export default reviewReducer;

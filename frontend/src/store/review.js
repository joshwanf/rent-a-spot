// const SET_SPOT_REVIEWS = "review/setSpotReview";
const GOT_REVIEWS = "review/gotReviews";
const CREATED_REVIEW = "review/createdReview";
const DELETED_REVIEW = "review/deletedReview";

// // Action creators

// /** @type {(reviews: App.ReviewsBySpotIdAPI) => App.GotReviewsBySpotIdAction} */
// const setSpotReview = (reviews) => {
//   return { type: GOT_SPOT_REVIEWS, reviews };
// };

// /** @type {(prop: {review: App.CreateReviewBySpotIdAPI, userInfo: App.User}) => App.CreatedReviewBySpotIdAction} */
// const createSpotReview = ({ review, userInfo }) => {
//   return { type: CREATED_REVIEW, payload: { review, userInfo } };
// };

// // Thunks
// export const getReviewsBySpot = (spotId) => async (dispatch) => {
//   try {
//     const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
//     const data = await response.json();
//     dispatch(setSpotReview(data));
//     return data;
//   } catch (err) {
//     const error = await err.json();
//     return error;
//   }
// };

// /**
//  * @typedef {Object} CreateReviewDetails
//  * @prop {{review: string, stars: number}} reviewDetails
//  * @prop {number} spotId
//  * @prop {App.User | null} userInfo
//  * @param {CreateReviewDetails} details
//  * @returns {(dispatch) => Promise<{type: "review", review: App.Review} | {type: "error", error: App.CreateReviewError}>}
//  */
// export const createReviewThunk =
//   ({ reviewDetails, spotId, userInfo }) =>
//   async (dispatch) => {
//     try {
//       const createReviewResponse = await csrfFetch(
//         `/api/spots/${spotId}/reviews`,
//         {
//           method: "POST",
//           body: JSON.stringify(reviewDetails),
//         }
//       );
//       const review = await createReviewResponse.json();
//       console.log("52452314", { review });
//       await dispatch(createSpotReview({ review, userInfo }));
//       //   await dispatch(getReviewsBySpot(spotId));
//       await dispatch(getOneSpot(spotId));

//       return { type: "review", review };
//     } catch (err) {
//       const error = await err.json();
//       return { type: "error", error };
//     }
//   };

// Reducer

/**
 * @param {Store.State.RootState['reviews']} state
 * @param {Store.ACs.ReviewAC} action
 * @return {Store.State.RootState['reviews']}
 */
const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case GOT_REVIEWS: {
      /** @type {Store.State.RootState['reviews']} */
      const reviews = {};
      for (const review of action.payload) {
        const { User, ReviewImages, ...rest } = review;
        const images = ReviewImages.map((image) => image.id);
        reviews[review.id] = { ...rest, images };
      }
      return { ...state, ...reviews };
    }
    case CREATED_REVIEW: {
      const reviewId = action.payload.id;
      return {
        ...state,
        [reviewId]: {
          ...state[reviewId],
          ...action.payload,
        },
      };
    }
    case DELETED_REVIEW: {
      const { [action.payload]: deleted, ...rest } = state;
      return { ...rest };
    }
    default:
      return state;
  }
};
export default reviewsReducer;

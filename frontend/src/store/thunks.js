import { csrfFetch } from "./csrf";

const GOT_ALL_SPOTS = "spots/gotAllSpots";
const GOT_ONE_SPOT = "spots/gotOneSpot";
// const CREATE_SPOT = "spot/createSpot";
// const ADD_IMAGES_TO_SPOT = "spot/addImages";
// const GOT_CURRENT_SPOTS = "spots/gotCurrentSpots";
const ADD_SPOT_IMAGE = "spotImages/addSpotImage";

// const SET_SPOT_REVIEWS = "review/setSpotReviews";
const GOT_REVIEWS = "review/gotReviews";
const CREATED_REVIEW = "review/createdReview";
// const DELETED_REVIEW = "review/deletedReview";

const SET_USERS = "users/setUsers";

// Action creators

/** @type {(spots: Store.API.GetAllSpots['Spots']) => Store.ACs.setAllSpots} */
const setAllSpots = (spots) => ({ type: GOT_ALL_SPOTS, payload: spots });

/** @type {(spot: Store.API.GetSpotDetailsById) => Store.ACs.setOneSpot} */
const setOneSpot = (spot) => ({ type: GOT_ONE_SPOT, payload: spot });

// /** @type {(spot: Store.Component.SpotFormSubmit) => Store.ACs.createOneSpot} */
// const createOneSpot = (spot) => ({ type: CREATE_SPOT, payload: spot });

/** @type {(spot: {id: number, spotId: number, url: string, preview: boolean}) => Store.ACs.addSpotImage} */
const addSpotImage = (image) => ({ type: ADD_SPOT_IMAGE, payload: image });

/** @type {(reviews: Store.API.GetAllReviewsBySpotId['Reviews']) => Store.ACs.setReviews} */
const setReviewsBySpot = (reviews) => ({ type: GOT_REVIEWS, payload: reviews });

/** @type {(prop: {review: Store.API.CreateAReview}) => App.CreatedReviewBySpotIdAction} */
const createReviewAC = ({ review }) => {
  return { type: CREATED_REVIEW, payload: review };
};

/** @type {(reviewId: number) => Store.ACs.deleteOneReview} */
const deleteOneReviewAC = (reviewId) => ({
  type: "review/deletedReview",
  payload: reviewId,
});

/** @type {(spotId: number) => Store.ACs.deleteOneSpot} */
const deleteOneSpotAC = (spotId) => ({
  type: "spot/deletedSpot",
  payload: spotId,
});

const setUsers = (users) => ({ type: SET_USERS, payload: users });

// Thunk action creators
/**
 * @param {number} [userId]
 * @returns {(_: React.Dispatch<import('redux').AnyAction>) => Promise<Store.ACs.getAllSpotsRes | Store.ACs.getAllSpotsErr>}
 */
export const getAllSpots = (userId) => async (dispatch) => {
  const hasUserId = typeof userId === "number";
  const endpoint = hasUserId ? "/api/spots/current" : "/api/spots";
  try {
    const response = await csrfFetch(endpoint);
    /** @type {Store.API.GetAllSpots} */
    const data = await response.json();
    const spotsWithFullPreviewImgUrl = data.Spots.map((spot) => ({
      ...spot,
      [spot["previewImage"]]: `/spot-images/${spot.id}/${spot.previewImage}`,
    }));
    dispatch(setAllSpots(spotsWithFullPreviewImgUrl));
    return { type: "spots", spots: data };
  } catch (err) {
    // console.log("unknown error", { err });
    // const error = await err.json();
    return { type: "error", error: err };
  }
};
// export const getAllSpotsOld = (userId) => async (dispatch) => {
//   const hasUserId = typeof userId === "number";
//   const endpoint = hasUserId ? "/api/spots/current" : "/api/spots";
//   try {
//     const response = await csrfFetch(endpoint);
//     const data = await response.json();
//     dispatch(setAllSpots(data.Spots));
//     return { type: "spots", spots: data };
//   } catch (err) {
//     const error = await err.json();
//     return { type: "error", error };
//   }
// };
// export const getAllSpots = () => async (dispatch) => {
//     try {
//       const response = await csrfFetch("/api/spots");
//       const data = await response.json();
//       dispatch(setAllSpots(data));
//       return data;
//     } catch (err) {
//       const error = await err.json();
//       return error;
//     }
//   };

/**
 * @param {number} spotId
 * @returns {(_: React.Dispatch<import('redux').AnyAction>) => Promise<Store.ACs.getOneSpotRes | Store.ACs.getOneSpotErr>}
 */
export const getOneSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    /** @type {Store.API.GetSpotDetailsById} */
    const data = await response.json();

    const emptyImgObj = {
      id: "noImage",
      url: "/no-image-found/no_image_available_600_x_450.svg",
      preview: true,
    };
    const previewImgObj =
      data.SpotImages.filter((image) => image.preview)[0] || emptyImgObj;
    const regularImgs = data.SpotImages.filter((image) => !image.preview);

    // Update store.spots with details and id references to spotImages, reviews, and owner
    dispatch(setOneSpot(data));

    // Update store.spotImages with full image data
    for (const image of [previewImgObj, ...regularImgs]) {
      dispatch(addSpotImage({ spotId, ...image }));
    }

    const spotOwner = data.Owner;
    dispatch(setUsers([spotOwner]));
    return { type: "spot", spot: data };
  } catch (err) {
    console.log("unknown error", { err });
    const error = await err.json();
    return { type: "error", error: err };
  }
};

/**
 * @param {number} spotId
 * @returns {(_: React.Dispatch<import('redux').AnyAction>) => Promise<Store.ACs.deleteOneSpotRes | Store.ACs.deleteOneSpotErr>}
 */
export const deleteOneSpotThunk = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    dispatch(deleteOneSpotAC(spotId));
    return { type: "success", success: data.message };
  } catch (err) {
    const error = await err.json();
    return { type: "error", error };
  }
};

// Thunks
/**
 * @param {number} spotId
 * @returns {(dispatch: React.Dispatch<import('redux').AnyAction>) => Promise<Store.ACs.getReviewsBySpotIdRes | Store.ACs.getReviewsBySpotIdErr>}
 */
export const getReviewsBySpotThunk = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    /** @type {Store.API.GetAllReviewsBySpotId} */
    const data = await response.json();
    const usersWhoWroteAReview = data.Reviews.map((review) => review.User);
    dispatch(setReviewsBySpot(data.Reviews));
    dispatch(setUsers(usersWhoWroteAReview));
    // dispatch(setReviewImages)
    return { type: "review", review: data };
  } catch (err) {
    const error = await err.json();
    return { type: "error", error };
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
      await dispatch(createReviewAC({ review, userInfo }));
      //   await dispatch(getReviewsBySpot(spotId));
      await dispatch(getOneSpot(spotId));

      return { type: "review", review };
    } catch (err) {
      const error = await err.json();
      return { type: "error", error };
    }
  };

/**
 * @param {number} reviewId
 * @param {number} spotId
 * @returns {(_: React.Dispatch<import('redux').AnyAction>) => Promise<Store.ACs.deleteOneReviewRes | Store.ACs.deleteOneReviewErr>}
 */
export const deleteOneReviewThunk = (reviewId, spotId) => async (dispatch) => {
  try {
    const deleteReviewRes = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
    await dispatch(deleteOneReviewAC(reviewId));
    const successRes = await deleteReviewRes.json();

    await dispatch(getOneSpot(spotId));
    return { type: "success", success: successRes };
  } catch (err) {
    const error = await err.json();
    return { type: "error", error };
  }
};

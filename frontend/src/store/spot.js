import { csrfFetch } from "./csrf";

const GOT_ALL_SPOTS = "spots/gotAllSpots";
const GOT_ONE_SPOT = "spots/gotOneSpot";
const CREATE_SPOT = "spot/createSpot";
const ADD_IMAGES_TO_SPOT = "spot/addImages";
const GOT_CURRENT_SPOTS = "spots/gotCurrentSpots";

// Action creators

/** @type {(spots: App.GetAllSpotsAPI) => App.GotAllSpotsAction} */
const setAllSpots = (spots) => ({ type: GOT_ALL_SPOTS, spots });

/** @type {(spot: App.GetSpotByIdAPI) => App.GotSpotByIdAction} */
const setOneSpot = (spot) => ({ type: GOT_ONE_SPOT, spot });

const createOneSpot = (spot) => ({ type: CREATE_SPOT, payload: spot });
const addImagesToSpot = (spotId, images) => ({
  type: ADD_IMAGES_TO_SPOT,
  payload: { spotId, images },
});

// Thunk action creators
export const getAllSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    dispatch(setAllSpots(data));
    return data;
  } catch (err) {
    const error = await err.json();
    return error;
  }
};

export const getOneSpot = (spotId) => async (dispatch) => {
  //   console.log("get one spot");
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const data = await response.json();
    dispatch(setOneSpot(data));
    return data;
  } catch (err) {
    const error = await err.json();
    return error;
  }
};

// Reducer
const initialState = {};
/**
 * @param {App.RootState['spots']} state
 * @param {App.GotAllSpotsAction | App.GotSpotByIdAction} action
 * @return {App.RootState['spots']}
 */
export const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case GOT_ALL_SPOTS: {
      /** @type {App.RootState['spots']} */
      const newSpots = {};
      for (const spot of action.spots.Spots) {
        const { previewImage, ...rest } = spot;
        const spotImages = { preview: previewImage, regular: [] };
        newSpots[spot.id] = {
          ...rest,
          images: spotImages,
        };
      }
      return {
        ...state,
        ...newSpots,
      };
    }
    case GOT_ONE_SPOT: {
      console.log("--", action);
      const { SpotImages, Owner, numReviews, avgStarRating, ...rest } =
        action.spot;

      //   /** @type {App.SpotSlice} */
      //   const newSpot = {};

      //   const spotImages = {};
      /** @type {App.SpotSlice['images']['preview'][]} */
      const previewImg = action.spot.SpotImages.filter(
        (image) => image.preview
      );
      /** @type {App.SpotSlice['images']['regular']} */
      const regularImgs = action.spot.SpotImages.filter(
        (image) => !image.preview
      );

      /** @type {App.SpotSlice} */
      const newSpot = {
        ...rest,
        numReviews,
        avgRating: avgStarRating,
        images: { preview: previewImg[0], regular: regularImgs },
        owner: action.spot.Owner,
      };
      //   newSpot.images = { preview: previewImg[0], regular: regularImgs };
      //   newSpot.numReviews = action.spot.numReviews;
      //   newSpot.avgRating = action.spot.avgStarRating;
      //   newSpot.owner = action.spot.Owner;

      return {
        ...state,
        [action.spot.id]: {
          ...state[action.spot.id],
          //   images: spotImages,
          ...newSpot,
        },
      };
    }
    // case CREATE_SPOT: {
    //   const newState = {
    //     ...state,
    //   };
    // }
    default:
      return state;
  }
};

/**
 * @param {{ type: SET_ONE_SPOT, spot: OneSpot }} action
 */
export const currentSpotReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

import { csrfFetch } from "./csrf";

/**
 * @typedef {{
 *   id: number,
 *   ownerId: number,
 *   address: string,
 *   city: string,
 *   state: string,
 *   country: string,
 *   lat: number,
 *   lng: number,
 *   name: string,
 *   description: string,
 *   price: number,
 *   createdAt: Date,
 *   updatedAt: Date
 * }} Spot
 * @typedef {{ id: number, url: string, preview: boolean }} SpotImage
 * @typedef {{ id: number, firstName: string, lastName: string }} SpotOwner
 */

/**
 * @typedef {Object} AllSpots
 * @prop {Array<Spot & {
 * avgRating: number,
 * previewImage: string
 * }>} Spots
 * @prop {number} page
 * @prop {number} size
 */

/**
 * @typedef {Object<number, Spot>} AllSpotsNorm
 * @prop {number} page
 * @prop {number} size
 */

/**
 * @typedef {Spot & {
 *   numReviews: number,
 *   avgStarRating: number,
 *   SpotImages: Array<SpotImage>
 *   Owner: SpotOwner
 * }} OneSpot
 */

const SET_ALL_SPOTS = "spot/setAllSpots";
const SET_ONE_SPOT = "spot/setOneSpot";

// Action creators
const setAllSpots = (spots) => ({ type: SET_ALL_SPOTS, payload: spots });
const setOneSpot = (spot) => ({ type: SET_ONE_SPOT, payload: spot });

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
const initialState = {
  page: 1,
  size: 20,
  AllSpots: {},
  CurrentSpot: {},
};
/**
 * @param {{
 * page: number
 * size: number
 * CurrentSpot: object
 * AllSpots: AllSpotsNorm
 * }} state
 * @param {{ type: string, payload: AllSpots | Spot }} action
 * @return {AllSpotsNorm}
 */
export const allSpotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_SPOTS: {
      const newState = { ...state };
      newState.page = action.payload.page;
      newState.size = action.payload.size;
      for (const spot of action.payload.Spots) {
        newState.AllSpots[spot.id] = spot;
      }
      return newState;
    }
    case SET_ONE_SPOT: {
      const newState = {
        ...state,
        CurrentSpot: action.payload,
      };
      return newState;
    }
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

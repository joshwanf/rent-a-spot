import { useSelector, useDispatch } from "react-redux";

// Imports
import configureStore from "./store";

// State types
/** @typedef {import('./session').RootState} SessionState */

/** @typedef {import('./spot').AllSpots} AllSpotsState */
/** @typedef {import('./spot').AllSpotsNorm} AllSpotsNorm */
/** @typedef {import('./spot').OneSpot} OneSpotState */

// Exports

// Selectors
/** @type {(state: App.RootState) => App.RootState['session']['user']} */
export const selectSession = (state) => state.session.user;

/** @type {(state: App.RootState) => App.RootState['spots']} */
export const selectAllSpots = (state) => state.spots;

/** @type {(spotId: number) => (state: App.RootState) => App.SpotSlice} */
export const selectOneSpot = (spotId) => (state) => state.spots[spotId];

/** @type {(state: App.RootState) => App.RootState['reviews']} */
export const selectReviews = (state) => state.reviews;

/** @type {(spotId: number) => (state: App.RootState) => App.ReviewSlice[]} */
export const selectReviewsBySpotId = (spotId) => (state) => {
  const reviews = Object.values(state.reviews);
  return reviews.filter((review) => review.spotId === spotId);
};

// Custom hoooks

/** @type {<T>(_: (_: App.RootState) => T) => T} */
export const useAppSelector = useSelector;

/**
 * @typedef {import('react').Dispatch<AnyAction>} Dispatch
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * @typedef {{
 * (inp:AnyAction): AnyAction;
 * <T>(inp: (_: Dispatch) => Promise<T>): Promise<T>;
 * }} DispatchTy
 */

/**
 * @type {() => DispatchTy}
 */
export const useAppDispatch = useDispatch;

export * from "./session";
export * from "./spot";
export * from "./review";
export default configureStore;

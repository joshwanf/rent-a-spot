import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

// Imports
import configureStore from "./store";

// State types

// Exports

// Selectors
/** @type {() => Store.State.RootState} */
export const createAppSelector = createSelector.withTypes();

/** @type {(state: Store.State.RootState) => Store.State.RootState['session']['user']} */
export const selectSession = (state) => state.session.user;

/** @typedef {(state: Store.State.RootState) => Store.State.RootState['spots']} selectAllSpots */
/** @type {selectAllSpots} */
export const selectAllSpots = (state) => state.spots;

export const selectAllSpotsArr = createSelector(selectAllSpots, (state) =>
  Object.values(state)
);

// // /** @type {(spotId: number) => (state: Store.State.RootState['spots']) => void} */

// // /**
// //  * @param {number} spotIds
// //  */
// export const selectSpotIds = createAppSelector(
//   selectAllSpots,
//   (state) => Object.values(state)
// );

// old function
export const selectOneSpot = (spotId) =>
  createSelector(selectAllSpots, (state) => state[spotId]);

/** @type {(userId: number | undefined) => (state: App.RootState) => App.SpotSlice[] | null} */
export const selectSpotsByUser = (userId) =>
  createSelector(selectAllSpots, (state) => {
    if (!userId) {
      return null;
    }
    const filteredSpots = Object.values(state).filter(
      (spot) => spot.ownerId === userId
    );
    return filteredSpots;
  });

/** @type {(state: App.RootState) => App.RootState['reviews']} */
export const selectReviews = (state) => state.reviews;

/** @type {(spotId: number) => (state: App.RootState) => App.ReviewSlice[]} */
export const selectReviewsBySpotId = (spotId) => (state) => {
  const reviews = Object.values(state.reviews);
  return reviews.filter((review) => review.spotId === spotId);
};

// Custom hoooks

/**
 * @typedef {import('react').Dispatch<AnyAction>} Dispatch
 * @typedef {import('redux').AnyAction} AnyAction
 */

/**
 * @typedef {{
 * (inp:AnyAction): AnyAction;
 * <T>(inp: (_: Dispatch) => Promise<T>): Promise<T>;
 * }} DispatchTy_old
 */

/** @type {() => Store.ReduxTypes.DispatchTy} */
export const useAppDispatch = useDispatch;

/** @type {<T>(_: (_: Store.State.RootState) => T) => T} */
export const useAppSelector = useSelector;

export * from "./thunks";
export * from "./session";
export * from "./spot";
export * from "./review";
export default configureStore;

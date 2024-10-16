import { useSelector } from "react-redux";

// Imports
import configureStore from "./store";

// State types
/** @typedef {import('./session').RootState} SessionState */

/** @typedef {import('./spot').AllSpots} AllSpotsState */
/** @typedef {import('./spot').AllSpotsNorm} AllSpotsNorm */
/** @typedef {import('./spot').OneSpot} OneSpotState */

// Exports

/**
 * @typedef {ReturnType<typeof rootReducer>} RootState
 */

/**
 * @type {<T>(_: (_: App.RootState) => T) => T}
 */
export const useAppSelector = useSelector;

export * from "./session";
export * from "./spot";
export * from "./review";
export default configureStore;

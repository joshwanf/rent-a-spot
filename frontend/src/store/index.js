import { useSelector, useDispatch } from "react-redux";

// Imports
import configureStore from "./store";

// State types
/** @typedef {import('./session').RootState} SessionState */

/** @typedef {import('./spot').AllSpots} AllSpotsState */
/** @typedef {import('./spot').AllSpotsNorm} AllSpotsNorm */
/** @typedef {import('./spot').OneSpot} OneSpotState */

// Exports

// Custom hoooks

/**
 * @type {<T>(_: (_: App.RootState) => T) => T}
 */
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

const ADD_SPOT_IMAGE = "spotImages/addSpotImage";
/**
 * @param {Store.State.RootState['spotImages']} state
 * @param {Store.ACs.SpotImageACs} action
 * @returns {Store.State.RootState['spotImages']}
 */
export const spotImagesReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_SPOT_IMAGE: {
      console.log("WEIRD SPOT IMAGE", action.payload);
      //   if (!action.payload.id) return state;
      const { spotId, url } = action.payload;
      const emptyImgObj = {
        id: "noImage",
        url: "/no-image-found/no_image_available_600_x_450.svg",
      };
      const imgWithFullUrl =
        action.payload.id !== "noImage"
          ? {
              ...action.payload,
              url: `/spot-images/${spotId}/${url}`,
            }
          : {
              ...action.payload,
              ...emptyImgObj,
            };
      return {
        ...state,
        [action.payload.id]: { ...imgWithFullUrl },
      };
    }
    default:
      return state;
  }
};

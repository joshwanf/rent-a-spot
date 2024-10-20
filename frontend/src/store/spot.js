const GOT_ALL_SPOTS = "spots/gotAllSpots";
const GOT_ONE_SPOT = "spots/gotOneSpot";
// const CREATE_SPOT = "spot/createSpot";
// const ADD_IMAGES_TO_SPOT = "spot/addImages";
// const GOT_CURRENT_SPOTS = "spots/gotCurrentSpots";
const DELETED_SPOT = "spot/deletedSpot";

// // Action creators

// /** @type {(spots: App.GetAllSpotsAPI) => App.GotAllSpotsAction} */
// const setAllSpots = (spots) => ({ type: GOT_ALL_SPOTS, spots });

// /** @type {(spot: App.GetSpotByIdAPI) => App.GotSpotByIdAction} */
// const setOneSpot = (spot) => ({ type: GOT_ONE_SPOT, spot });

// const createOneSpot = (spot) => ({ type: CREATE_SPOT, payload: spot });
// const addImagesToSpot = (spotId, images) => ({
//   type: ADD_IMAGES_TO_SPOT,
//   payload: { spotId, images },
// });

// // Thunk action creators
// export const getAllSpots = (userId) => async (dispatch) => {
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
// // export const getAllSpots = () => async (dispatch) => {
// //     try {
// //       const response = await csrfFetch("/api/spots");
// //       const data = await response.json();
// //       dispatch(setAllSpots(data));
// //       return data;
// //     } catch (err) {
// //       const error = await err.json();
// //       return error;
// //     }
// //   };

// export const getOneSpot = (spotId) => async (dispatch) => {
//   //   console.log("get one spot");
//   try {
//     const response = await csrfFetch(`/api/spots/${spotId}`);
//     const data = await response.json();
//     dispatch(setOneSpot(data));
//     return data;
//   } catch (err) {
//     const error = await err.json();
//     return error;
//   }
// };

// Reducer

/**
 * @param {Store.State.RootState['spots']} state
 * @param {Store.ACs.SpotACs} action
 * @returns {Store.State.RootState['spots']}
 */
export const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case GOT_ALL_SPOTS: {
      /** @type {Store.State.RootState['spots']} */
      const newSpots = {};
      for (const spot of action.payload) {
        const { previewImage, avgRating, ...rest } = spot;
        const previewImgUrl =
          previewImage !== "no preview image"
            ? `${previewImage}`
            : "/no-image-found/no_image_available_600_x_450.svg";
        // const previewImgWithFullUrl =
        //   previewImage !== "no preview image"
        //     ? `/spot-images/${spot.id}/${previewImage}`
        //     : "/no-image-found/no_image_available_600_x_450.svg";
        // convert avgRating to decimal with 1 sigfig
        // need Number(avgRating) because postgres sends back a string somehow
        // console.log(
        //   "toFixed is not a function?",
        //   { avgRating },
        //   typeof avgRating
        // );
        const rating =
          Number(avgRating) !== 0 ? Number(avgRating).toFixed(1) : "New";

        newSpots[spot.id] = {
          ...state[spot.id],
          ...rest,
          rating,
          previewImageUrl: previewImgUrl,
        };
      }
      return { ...state, ...newSpots };
    }
    case GOT_ONE_SPOT: {
      const { SpotImages, Owner, avgStarRating, numReviews, ...rest } =
        action.payload;
      const emptyImgObj = {
        id: "noImage",
        url: "/no-image-found/no_image_available_600_x_450.svg",
      };
      //   const imgsWithFullUrl = SpotImages.map((spotImg) => ({
      //     ...spotImg,
      //     url: `/spot-images/${action.payload.id}/${spotImg.url}`,
      //   }));
      const previewImgObj =
        SpotImages.filter((image) => image.preview)[0] || emptyImgObj;
      const regularImgs = SpotImages.filter((image) => !image.preview).map(
        (image) => image.id
      );
      // need Number(avgRating) because postgres sends back a string somehow
      const rating =
        Number(avgStarRating) !== 0 ? Number(avgStarRating).toFixed(1) : "New";

      /** @type {Store.State.Spots} */
      const newSpot = {
        ...rest,
        numReviews: Number(numReviews),
        rating,
        previewImageUrl: previewImgObj.url,
        previewImg: previewImgObj.id,
        regularImgs,
      };
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...newSpot,
        },
      };
    }
    // case GOT_ONE_SPOT_OLD: {
    //     const { SpotImages, Owner, numReviews, avgStarRating, ...rest } =
    //       action.payload;

    //     const previewImg = SpotImages.filter((image) => image.preview)[0].id;
    //     const regularImgs = SpotImages.filter((image) => !image.preview).map(
    //       (image) => image.id
    //     );

    //     //   const previewImgs = SpotImages.filter((image) => image.preview);
    //     //   const previewImg = previewImgs.length > 0 ? previewImgs[0].url : "";
    //     /** @type {App.SpotSlice['images']['regular']} */
    //     //   const regularImgs = SpotImages.filter((image) => !image.preview);
    //     const rating = avgStarRating !== 0 ? avgStarRating.toFixed(1) : "New";

    //     /** @type {App.SpotSlice} */
    //     const newSpot = {
    //       ...rest,
    //       numReviews,
    //       avgRating: avgStarRating,
    //       images: { preview: previewImg, regular: regularImgs },
    //       owner: action.payload.Owner,
    //     };
    //     //   newSpot.images = { preview: previewImg[0], regular: regularImgs };
    //     //   newSpot.numReviews = action.spot.numReviews;
    //     //   newSpot.avgRating = action.spot.avgStarRating;
    //     //   newSpot.owner = action.spot.Owner;

    //     return {
    //       ...state,
    //       [action.spot.id]: {
    //         ...state[action.spot.id],
    //         //   images: spotImages,
    //         ...newSpot,
    //       },
    //     };
    //   }
    case DELETED_SPOT: {
      const { [action.payload]: deleted, ...rest } = state;
      return { ...rest };
    }
    default:
      return state;
  }
};

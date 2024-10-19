declare namespace App {
  // Base types from db columns
  interface Base {
    createdAt: Date;
    updatedAt: Date;
  }
  interface User extends Base {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  }
  interface Spot extends Base {
    id: number;
    ownerId: number;
    address: string;
    city: string;
    state: string;
    country: string;
    lat: number | undefined;
    lng: number | undefined;
    name: string;
    description: string;
    price: number | undefined;
  }
  interface Review extends Base {
    id: number;
    userId: number;
    spotId: number;
    review: string;
    stars: number;
  }
  interface Image extends Base {
    id: number;
    url: string;
  }
  interface SpotImage extends Image {
    spotId: number;
    preview: boolean;
  }
  interface ReviewImage extends Image {
    reviewId: number;
  }

  // API return types
  interface UserAPI {
    user: Omit<User, "createdAt" | "updatedAt" | "password">;
  }
  interface GetAllSpotsAPI {
    Spots: (Spot & { avgRating: number; previewImage: string })[];
  }
  interface SpotsByCurrentUserAPI extends GetAllSpotsAPI {}
  interface GetSpotByIdAPI extends Spot {
    numReviews: number;
    avgStarRating: number;
    SpotImages: SpotImage[];
    Owner: UserAPI["user"];
  }
  interface ReviewsByCurrentUserAPI {
    Reviews: (Review & {
      User: Omit<UserAPI["user"], "username" | "email">;
      Spot: Omit<
        GetAllSpotsAPI["Spots"],
        "createdAt" | "updatedAt" | "avgRating"
      >;
      ReviewImages: Array<
        Omit<ReviewImage, "createdAt" | "updatedAt" | "reviewId">
      >;
    })[];
  }
  interface ReviewsBySpotIdAPI {
    Reviews: (Review & {
      User: Omit<UserAPI["user"], "username" | "email">;
      ReviewImages: Array<
        Omit<ReviewImage, "createdAt" | "updatedAt" | "reviewId">
      >;
    })[];
  }
  interface CreateReviewBySpotIdAPI extends Review {}

  // Normalized data in store
  interface SpotsByIdNorm {}
  interface ReviewsByCurrentUserNorm {
    [id: number]: ReviewsByCurrentUserAPI;
  }
  interface ReviewsBySpotIdNorm {
    [id: number]: ReviewsBySpotIdAPI;
  }

  // Store state
  type UserSlice = {
    id: number;
    firstName: string;
    lastName: string;
  };
  type SpotSlice = Spot & {
    numReviews?: number;
    avgRating: number;
    images: {
      preview: string;
      regular: Array<SpotImage>;
    };
    reviews?: Array<number>;
    owner: Omit<User, "createdAt" | "updatedAt" | "password">;
  };
  type ReviewSlice = Review & {
    user: UserSlice;
    images: Array<Omit<ReviewImage, "createdAt" | "updatedAt" | "reviewId">>;
  };
  interface RootState {
    session: { user: App.User | null };
    spots: Record<number, SpotSlice>;
    reviews: Record<number, ReviewSlice>;
    users: Record<number, UserSlice>;
  }

  // Store action creators
  interface GotAllSpotsAction {
    type: "spots/gotAllSpots";
    spots: GetAllSpotsAPI["Spots"];
  }
  interface GotSpotByIdAction {
    type: "spots/gotOneSpot";
    spot: GetSpotByIdAPI;
  }
  interface GotOneUserAction {
    type: "users/gotOneUser";
    user: UserAPI;
  }
  interface GotCurrentSpotsAction {
    type: "spots/gotCurrentSpots";
    spots: GetAllSpotsAPI;
  }
  interface GotReviewsBySpotIdAction {
    type: "review/gotSpotReviews";
    reviews: ReviewsBySpotIdAPI;
  }
  interface CreatedReviewBySpotIdAction {
    type: "review/createdReview";
    payload: reateReviewBySpotIdAPI;
  }
  interface ReviewReducerActionTypes {
    type: "review/gotSpotReviews" | "review/createdReview";
  }

  // Error responses
  interface CreateSpotError {
    message: string;
    errors: {
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      lat?: string;
      lng?: string;
      name?: string;
      description?: string;
      price?: string;
    };
  }
  interface CreateReviewError {
    message: string;
    errors: {
      review?: string;
      stars?: string;
    };
  }
  // Component types
  interface SpotFormData {
    country: string;
    address: string;
    city: string;
    state: string;
    lat: number | "";
    lng: number | "";
    description: string;
    name: string;
    price: number | "";
  }
  interface SpotFormImg {
    imgPreview: string;
    img1: string;
    img2: string;
    img3: string;
    img4: string;
  }
  interface SpotFormLabel {
    heading: string;
    caption: string;
    fieldName: string;
    placeholder: string;
    value: string | number | undefined;
    onChangeHandler:
      | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
      | undefined;
    isTextarea?: "input" | "textarea";
    inputType?: "number";
    hrAfter?: boolean;
    error?: string;
  }
  interface SpotFormValidatorResult {
    pass: boolean;
    message: string;
  }
}

declare namespace Store {
  // Base types from db columns
  declare namespace DB {
    interface Base {
      createdAt: Date;
      updatedAt: Date;
    }
    interface User extends Base {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      username: string;
      password: string;
    }
    interface Spot extends Base {
      id: number;
      ownerId: number;
      address: string;
      city: string;
      state: string;
      country: string;
      lat: number;
      lng: number;
      name: string;
      description: string;
      price: number;
    }
    interface Review extends Base {
      id: number;
      userId: number;
      spotId: number;
      review: string;
      stars: number;
    }
    interface Image extends Base {
      id: number;
      url: string;
    }
    interface SpotImage extends Image {
      spotId: number;
      preview: boolean;
    }
    interface ReviewImage extends Image {
      reviewId: number;
    }
  }
  declare namespace Component {
    interface SpotFormData {
      country: string;
      address: string;
      city: string;
      state: string;
      lat: number | undefined;
      lng: number | undefined;
      description: string;
      name: string;
      price: number | undefined;
    }
    interface SpotFormImg {
      imgPreview: string;
      img1: string;
      img2: string;
      img3: string;
      img4: string;
    }
    interface SpotFormSubmit {
      data: SpotFormData;
      imgs: SpotFormImg;
    }
  }
  // API return
  declare namespace API {
    interface User {
      user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        username: string;
      };
    }
    interface GetAllSpots {
      Spots: ({
        id: number;
        ownerId: number;
        address: string;
        city: string;
        state: string;
        country: string;
        lat: number;
        lng: number;
        name: string;
        description: string;
        price: number;
        avgRating: number;
        previewImage: string;
      } & DB.Base)[];
    }
    interface GetAllSpotsError {
      message: string;
    }
    interface GetAllSpotsByCurrentUser extends GetAllSpots {}
    interface GetSpotDetailsById {
      id: number;
      ownerId: number;
      address: string;
      city: string;
      state: string;
      country: string;
      lat: number;
      lng: number;
      name: string;
      description: string;
      price: number;
      numReviews: number;
      avgStarRating: number;
      SpotImages: {
        id: number;
        url: string;
        preview: boolean;
      }[];
      Owner: {
        id: number;
        firstName: string;
        lastName: string;
      }[];
    }
    interface GetSpotDetailsByIdError {
      message: "Spot couldn't be found";
    }
    interface CreateASpot extends DB.Spot {}
    interface AddImageToSpot {
      id: number;
      url: string;
      preview: boolean;
    }
    interface EditASpot extends CreateASpot {}
    interface DeleteASpot {
      message: "Successfully deleted";
    }
    interface DeleteASpotError {
      message: "Spot couldn't be found";
    }
    interface GetAllReviewsByCurrentUser {
      Reviews: ({
        id: number;
        userId: number;
        spotId: number;
        review: string;
        stars: number;
      } & DB.Base & {
          User: {
            id: number;
            firstName: string;
            lastName: string;
          };
        } & {
          Spot: {
            // no description from DB.Spot
            // includes previewImage
            id: number;
            ownerId: number;
            address: string;
            city: string;
            state: string;
            country: string;
            lat: number;
            lng: number;
            name: string;
            price: number;
            previewImage: string;
          };
          ReviewImages: {
            id: number;
            url: string;
          }[];
        })[];
    }
    interface GetAllReviewsBySpotId {
      Reviews: (DB.Review &
        DB.Base & {
          User: {
            id: number;
            firstName: string;
            lastName: string;
          };
        } & {
          ReviewImages: {
            id: number;
            url: string;
          }[];
        })[];
    }
    interface GetAllReviewsBySpotIdError extends GetSpotDetailsById {}
    interface CreateAReview extends DB.Review {}
    interface AddImageToReview {
      id: number;
      url: string;
    }
    interface EditAReview extends CreateAReview {}
    interface DeleteAReview {
      message: "Successfully deleted";
    }
    interface DeleteAReviewError {
      message: "Review couldn't be found";
    }
  }
  declare namespace State {
    interface RootState {
      session: Session;
      users: Record<number, Users>;
      spots: Record<number, Spots>;
      spotImages: Record<number | "noImage", SpotImages>;
      reviews: Record<number, Reviews>;
      reviewImages: Record<number, ReviewImages>;
    }
    interface Session {
      user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        username: string;
      };
    }
    interface Users {
      id: number;
      firstName: string;
      lastName: string;
    }
    interface Spots {
      id: number;
      ownerId: number;
      address: string;
      city: string;
      state: string;
      country: string;
      lat: number;
      lng: number;
      name: string;
      description: string;
      price: number;
      rating: string;
      numReviews?: number;
      previewImageUrl: string;
      previewImg?: SpotImages["id"];
      regularImgs?: SpotImages["id"][];
      reviews?: Reviews["id"][];
    }
    interface SpotImages {
      id: number;
      spotId: Spots["id"];
      url: string;
      preview: boolean;
    }
    interface Reviews {
      id: number;
      userId: Users["id"];
      spotId: Spots["id"];
      review: string;
      stars: number;
      createdAt: Date;
      updatedAt: Date;
      images: ReviewImages["id"][];
    }
    interface ReviewImages {
      id: number;
      reviewId: number;
      url: string;
    }
  }
  declare namespace ACs {
    // Action creator types
    interface setAllSpots {
      type: "spots/gotAllSpots";
      payload: API.GetAllSpots["Spots"];
    }
    interface setOneSpot {
      type: "spots/gotOneSpot";
      payload: API.GetSpotDetailsById;
    }
    interface createOneSpot {
      type: "spot/createSpot";
      payload: Component.SpotFormSubmit;
    }
    interface deleteOneSpot {
      type: "spot/deletedSpot";
      payload: number;
    }
    type SpotACs = setAllSpots | setOneSpot | createOneSpot | deleteOneSpot;

    interface addSpotImage {
      type: "spotImages/addSpotImage";
      payload: {
        id: number | "noImage";
        spotId: number;
        url: string;
        preview: boolean;
      };
    }
    type SpotImageACs = addSpotImage;

    interface setReviews {
      type: "review/gotReviews";
      payload: API.GetAllReviewsBySpotId["Reviews"];
    }
    interface createOneReview {
      type: "review/createdReview";
      payload: API.CreateAReview;
    }
    interface deleteOneReview {
      type: "review/deletedReview";
      payload: number;
    }
    type ReviewAC = setReviews | createOneReview | deleteOneReview;

    // Thunk responses
    interface getAllSpotsRes {
      type: "spots";
      spots: API.GetAllSpots;
    }
    interface getAllSpotsErr {
      type: "error";
      error: API.GetAllSpotsError;
    }
    interface getOneSpotRes {
      type: "spot";
      spot: API.GetSpotDetailsById;
    }
    interface getOneSpotErr {
      type: "error";
      error: API.GetSpotDetailsByIdError;
    }
    interface deleteOneSpotRes {
      type: "success";
      success: "Successfully deleted";
    }
    interface deleteOneSpotErr {
      type: "error";
      //   error: "Spot couldn't be found";
      error: Store.API.DeleteASpotError;
    }
    interface getReviewsBySpotIdRes {
      type: "review";
      review: API.GetAllReviewsBySpotId;
    }
    interface getReviewsBySpotIdErr {
      type: "error";
      error: API.GetAllReviewsBySpotIdError;
    }
    interface deleteOneReviewRes {
      type: "success";
      success: "Successfully deleted";
    }
    interface deleteOneReviewErr {
      type: "error";
      error: Store.API.DeleteAReviewError;
    }
  }
  declare namespace ReduxTypes {
    interface DispatchTy {
      (inp: AnyAction): AnyAction;
      <T>(inp: (_: Dispatch) => Promise<T>): Promise<T>;
    }
  }
}

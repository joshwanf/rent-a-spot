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
      preview: SpotImage;
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
    spots: GetAllSpotsAPI;
  }
  interface GotSpotByIdAction {
    type: "spots/gotOneSpot";
    spot: GetSpotByIdAPI;
  }
  interface GotOneUserAction {
    type: "users/gotOneUser";
    user: UserAPI;
  }
  interface GotReviewsBySpotIdAction {
    type: "review/gotSpotReviews";
    reviews: ReviewsBySpotIdAPI;
  }
  interface CreatedReviewBySpotIdAction {
    type: "review/createdReview";
    payload: {
      review: CreateReviewBySpotIdAPI;
      userInfo: App.User;
    };
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
  interface CreateSpotForm {}
  interface CreateSpotFormLabel {
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

    error2?: function;
  }
}

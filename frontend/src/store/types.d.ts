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

  // API return types
  interface UserAPI {
    user: Omit<User, "createdAt" | "updatedAt" | "password">;
  }
  interface GetAllSpotsAPI {
    Spots: (Spot & { avgRating: number; previewImage: string })[];
  }
  interface SpotsByCurrentUserAPI extends GetAllSpotsAPI {}
  interface SpotByIdAPI extends Spot {
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
  interface ReviewsBySpotIdAPI extends ReviewsByCurrentUserAPI {}

  // Normalized data in store
  interface SpotsByIdNorm {}
  interface ReviewsByCurrentUserNorm {
    [id: number]: ReviewsByCurrentUserAPI;
  }
  interface ReviewsBySpotIdNorm {
    [id: number]: ReviewsBySpotIdAPI;
  }

  // Store data
  interface RootState {
    session: { user: User | null };
    spot: {
      page: number;
      size: number;
      AllSpots: GetAllSpotsAPI;
      CurrentSpot: SpotByIdAPI;
    };
    review: {
      spotReviews: ReviewsBySpotIdNorm;
    };
  }
}

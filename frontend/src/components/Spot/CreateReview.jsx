import { useState } from "react";
import { FaStar } from "react-icons/fa";
// import { csrfFetch } from "../../store/csrf";
import {
  useAppDispatch,
  useAppSelector,
  selectSession,
  //   getReviewsBySpotThunk,
} from "../../store";
// import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { createReviewThunk } from "../../store";
import { Error } from "../Error";
import "../../css/CreateReview.css";

// /** @type {({endpoint, body}: {endpoint: string, body: any}) => Promise<Response> } */
// const postAPI = async ({ endpoint, body }) => {
//   return csrfFetch(endpoint, {
//     method: "POST",
//     body: JSON.stringify(body),
//   });
// };

// /**
//  * @typedef {Object} CreateReviewDetails
//  * @prop {{review: string, stars: number}} reviewDetails
//  * @prop {number} spotId
//  * @param {CreateReviewDetails} details
//  * @returns {Promise<{type: "review", review: App.Review} | {type: "error", error: App.CreateReviewError}>}
//  */
// const handleCreateReview = async ({ reviewDetails, spotId }) => {
//   try {
//     console.log(`/api/spots/${spotId}/reviews`);
//     const createReviewResponse = await postAPI({
//       endpoint: `/api/spots/${spotId}/reviews`,
//       body: reviewDetails,
//     });
//     const review = await createReviewResponse.json();

//     return { type: "review", review };
//   } catch (err) {
//     const error = await err.json();
//     return { type: "error", error };
//   }
// };

export const CreateReview = ({ spotId }) => {
  const [reviewForm, setReviewForm] = useState({ stars: 0, review: "" });
  const [starHover, setStarHover] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [errors, setErrors] = useState({});
  const userInfo = useAppSelector(selectSession);
  const dispatch = useAppDispatch();
  const { closeModal } = useModal();

  const isDisabledSubmit =
    reviewForm.stars < 1 || reviewForm.review.length < 10;
  //   const { spotId } = useParams();
  const isActiveStar = (star) => {
    if (isHovered) {
      return star <= starHover;
    } else {
      return star <= reviewForm.stars;
    }
  };

  const handleStarHoverIn = (star) => () => {
    setStarHover(star);
    setIsHovered(true);
  };
  const handleStarHoverOut = () => {
    setStarHover(0);
    setIsHovered(false);
  };
  const handleReviewChange = (e) => {
    const newState = {
      ...reviewForm,
      review: e.target.value,
    };
    setReviewForm(newState);
  };
  const handleStarChange = (star) => (e) => {
    e.preventDefault();
    if (star === reviewForm.stars) {
      setReviewForm({
        ...reviewForm,
        stars: 0,
      });
    } else {
      const newState = {
        ...reviewForm,
        stars: star,
      };
      setReviewForm(newState);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      createReviewThunk({
        reviewDetails: reviewForm,
        spotId: spotId,
        userInfo,
      })
    );
    if (response.type === "error") {
      setErrors(response.error.errors);
    } else if (response.type === "review") {
      closeModal();
    }
  };
  return (
    <div className="create-review">
      <h1>How was your stay?</h1>
      <Error errors={errors} />
      <form onSubmit={handleSubmitReview}>
        <textarea
          onChange={handleReviewChange}
          placeholder="Leave your review here..."
        />
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= reviewForm.stars ? "review-star-active" : ""}
              onMouseEnter={handleStarHoverIn(star)}
              onMouseLeave={handleStarHoverOut}
            >
              <FaStar
                onClick={handleStarChange(star)}
                className={
                  isActiveStar(star) ? "review-star-active" : "review-star"
                }
              />
            </span>
          ))}
          Stars
        </div>
        <button disabled={isDisabledSubmit}>Submit Your Review</button>
      </form>
    </div>
  );
};

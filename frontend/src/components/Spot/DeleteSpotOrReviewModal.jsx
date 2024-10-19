import { useState } from "react";
import { useModal } from "../../context/Modal";
import { useAppDispatch } from "../../store";
import { deleteOneSpotThunk } from "../../store";
import { Error } from "../Error";
import { deleteOneReviewThunk } from "../../store";
import "../../css/DeleteSpotOrReviewModal.css";

/** @type {(props: {resourceId: number, resourceType: 'Spot' | 'Review', spotId?: number}) => JSX.Element} */
export const DeleteSpotOrReviewModal = ({
  resourceId,
  resourceType,
  spotId,
}) => {
  const { closeModal } = useModal();
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState({});
  const handleClickDelete = async () => {
    if (resourceType === "Spot") {
      /** @type {Store.ACs.deleteOneSpotRes | Store.ACs.deleteOneSpotErr} */
      const deleteSpotRes = await dispatch(deleteOneSpotThunk(resourceId));
      if (deleteSpotRes.type === "success") {
        closeModal();
      } else if (deleteSpotRes.type === "error") {
        setErrors(deleteSpotRes.error.message);
      }
    } else if (resourceType === "Review") {
      /** @type {Store.ACs.deleteOneReviewRes | Store.ACs.deleteOneReviewErr} */
      const deleteReviewRes = await dispatch(
        deleteOneReviewThunk(resourceId, spotId)
      );
      if (deleteReviewRes.type === "success") {
        closeModal();
      } else if (deleteReviewRes.type === "error") {
        setErrors(deleteReviewRes.error.message);
      }
    }
  };
  return (
    <div className="delete-spot-modal">
      <Error errors={errors} />
      <h2>Confirm Delete</h2>
      <div>
        Are you sure you want to remove this {resourceType.toLowerCase()}?
      </div>
      <button className="delete-yes" onClick={handleClickDelete}>
        Yes (Delete {resourceType})
      </button>
      <button className="delete-no" onClick={() => closeModal()}>
        No (Keep {resourceType})
      </button>
    </div>
  );
};

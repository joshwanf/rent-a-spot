import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  selectOneSpot,
  useAppSelector,
  useAppDispatch,
  getOneSpot,
} from "../../store";
import { SpotForm } from "./SpotForm";

export const EditSpot = () => {
  const { spotId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(getOneSpot(Number(spotId)));
    })();
  }, [dispatch, spotId]);

  const spot = useAppSelector(selectOneSpot(Number(spotId)));
  const spotImages = useAppSelector((state) =>
    Object.values(state.spotImages).filter(
      (image) => image.spotId === Number(spotId)
    )
  );

  if (!spot || !spotImages.length) {
    return <h1>Loading the spot to edit...</h1>;
  }

  const previewImgUrl = spotImages.filter((img) => img.preview)[0]?.url;
  const regularImgUrls = spotImages.filter((img) => !img.preview);
  // regularImgUrls could be array of length between 0 and 4
  // if regularImgUrls.length < 4, (img4, img3, ...) is undefined
  // if an img is undefined, react will complain when changing the form to a string
  const [img1, img2, img3, img4] = regularImgUrls.map((img) => img.url);

  // spotData and spotImg aren't closer to spot and img definitions because component return depends on having spot
  /** @type {App.SpotFormData} */
  const spotData = {
    country: spot.country,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    lat: spot.lat,
    lng: spot.lng,
    description: spot.description,
    name: spot.name,
    price: spot.price,
  };
  /** @type {App.SpotFormImg} */
  const spotImg = {
    imgPreview: previewImgUrl,
    img1: img1 || "",
    img2: img2 || "",
    img3: img3 || "",
    img4: img4 || "",
  };
  return (
    <div>
      <SpotForm initialData={spotData} initialImg={spotImg} />
    </div>
  );
};

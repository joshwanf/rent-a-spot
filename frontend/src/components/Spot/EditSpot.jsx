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
  const spot = useAppSelector(selectOneSpot(Number(spotId)));
  const spotImages = useAppSelector((state) =>
    Object.values(state.spotImages).filter(
      (image) => image.spotId === Number(spotId)
    )
  );
  const previewImgUrl = spotImages.filter((img) => img.preview)[0]?.url || "";
  const regularImgUrls = spotImages.filter((img) => !img.preview);
  const [img1, img2, img3, img4] = regularImgUrls.map((img) => img.url || "");
  console.log("imgs", { previewImgUrl, img1, img2, img3, img4 });

  useEffect(() => {
    (async () => {
      await dispatch(getOneSpot(Number(spotId)));
    })();
  }, [dispatch, getOneSpot]);

  //   /** @type {App.SpotFormData} */
  //   const spotData = {};
  if (!spot) {
    return <h1>Loading the spot to edit...</h1>;
  }

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
  //   const [img1, img2, img3, img4] = spot.images["regular"];
  /** @type {App.SpotFormImg} */
  const spotImg = {
    imgPreview: previewImgUrl,
    // imgPreview: spot.images["preview"],
    img1: img1?.url ?? "",
    img2: img2?.url ?? "",
    img3: img3?.url ?? "",
    img4: img4?.url ?? "",
  };

  return (
    <div>
      <SpotForm initialData={spotData} initialImg={spotImg} />
    </div>
  );
};

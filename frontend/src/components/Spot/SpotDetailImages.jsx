import { useAppSelector } from "../../store";
/** @type {(props: { images: {preview: number, regular: number[]}, spotId: number}) => JSX.Element} */
export const SpotDetailImages = ({ images, spotId }) => {
  const previewImg = useAppSelector(
    (state) => state.spotImages[images.preview]
  );
  const regularImgs = images.regular
    .map((id) => useAppSelector((state) => state.spotImages[id]))
    .filter((image) => image !== undefined);

  if (!images) {
    return <div>"loading images"</div>;
  }
  return (
    <div className="spot-detail-imgs">
      {previewImg && <img src={previewImg.url} className="spot-img-preview" />}
      {regularImgs.length > 0 &&
        regularImgs.map((image, i) => (
          <img key={i} src={image.url} className="spot-img" />
        ))}
    </div>
  );
};

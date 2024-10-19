import { useAppSelector } from "../../store";
import { selectAllSpotImgs } from "../../store";
/** @type {(props: { images: {preview: number, regular: number[]}}) => JSX.Element} */
export const SpotDetailImages = ({ images }) => {
  const allSpotImgs = useAppSelector(selectAllSpotImgs);
  const previewImg = allSpotImgs[images.preview];
  const regularImgs = Object.values(allSpotImgs).filter((img) =>
    images.regular.includes(img.id)
  );
  //   const regularImgs = images.regular
  //     .map((id) => useAppSelector((state) => state.spotImages[id]))
  //     .filter((image) => image !== undefined);

  if (!images) {
    return <div>Loading spot images...</div>;
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

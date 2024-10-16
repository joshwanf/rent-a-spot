/** @typedef {import('../../store').SpotImage} SpotImage */

/**
 * @param {object} props
 * @param {Array<SpotImage>} props.images
 * @returns {JSX.Element}
 */
export const SpotDetailImages = ({ images }) => {
  const previewImage = images.filter((image) => image.preview)[0];
  const remainingImages = images.filter((image) => !image.preview);
  return (
    <div className="spot-detail-imgs">
      <img className="spot-img-preview" src={previewImage.url} />
      {remainingImages.map((image) => (
        <img key={image.id} src={image.url} className="spot-img" />
      ))}
    </div>
  );
};

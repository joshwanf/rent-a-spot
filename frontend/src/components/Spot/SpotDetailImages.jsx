/** @type {(props: { images: Array<string>, spotId: number}) => JSX.Element} */
export const SpotDetailImages = ({ images, spotId }) => {
  if (!images) {
    return <div>"loading images"</div>;
  }
  //   const previewImage = images.filter((image) => image.preview)[0];
  //   const remainingImages = images.filter((image) => !image.preview);
  return (
    <div className="spot-detail-imgs">
      {images.map((image, i) => (
        <img
          key={i}
          src={`/spot-images/${spotId}/${image}`}
          className={`"spot-img" ${i === 0 ? "spot-img-preview" : ""}`}
        />
      ))}
    </div>
  );
};

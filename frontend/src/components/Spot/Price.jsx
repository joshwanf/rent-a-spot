/**
 *
 * @param {object} props
 * @param {number | undefined} props.price
 * @returns {JSX.Element}
 */
export const Price = ({ price }) => {
  return <div>${price}/night</div>;
};

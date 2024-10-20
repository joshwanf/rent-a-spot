/**
 *
 * @param {object} props
 * @param {number | undefined} props.price
 * @returns {JSX.Element}
 */
export const Price = ({ price }) => {
  return <div data-testid="spot-price">${price}/night</div>;
};

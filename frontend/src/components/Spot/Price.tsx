interface PriceProps {
  price: number | undefined;
}

export const Price = ({ price }: PriceProps) => {
  return <div data-testid="spot-price">${price}/night</div>;
};

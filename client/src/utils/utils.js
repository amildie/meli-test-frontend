function formatPrice(price) {
  return (
    <>
      {
        (price.currency === 'ARS'
          ? `$ ${price.amount.toLocaleString()}`
          : `${price.currency}$ ${price.amount.toLocaleString()}`).replace(/,/g, '.')
        }
      <sup>{price.decimals ? price.decimals : '00' }</sup>
    </>
  );
}

export default formatPrice;

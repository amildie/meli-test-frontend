import { useState, useEffect } from 'react';
import formatPrice from '../utils/utils';

function ItemView(props) {
  const [itemDetails, setItemDetails] = useState({});
  const [doneFetching, setDoneFetching] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3232/api/items/${props.id}`)
      .then((res) => res.json())
      .then((jsonRes) => {
        setItemDetails({
          title: jsonRes.item.title,
          condition: jsonRes.item.condition,
          freeShipping: jsonRes.item.free_shipping,
          picture: jsonRes.item.picture,
          price: jsonRes.item.price,
          soldQuantity: jsonRes.item.sold_quantity,
          description: jsonRes.item.description,
        });
        props.setBreadcrumbCallback(jsonRes.categories);
      })
      .then(() => {
        setDoneFetching(true);
      });
  }, []);

  return (
    <div className="ItemView">
      {doneFetching && (
        <>
          <div className="itemViewPicture" aria-label="itemViewPicture">
            <img src={itemDetails.picture} />
          </div>
          <div className="itemViewDesc" aria-label="itemViewDesc">
            Descripción del producto
            <div className="itemViewDescContentWrppr">
              {itemDetails.description}
            </div>
          </div>
          <div className="itemViewDetails" aria-label="itemViewDetails">
            {itemDetails.condition === 'new' ? 'Nuevo' : 'Usado' }
            {' - '}
            {itemDetails.soldQuantity}
            {' '}
            vendidos
            <div className="itemViewTitle">
              {itemDetails.title}
            </div>
            <div className="itemViewPrice">
              {formatPrice(itemDetails.price)}
            </div>
            <button type="button" className="itemViewBuyBtn">Comprar</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ItemView;

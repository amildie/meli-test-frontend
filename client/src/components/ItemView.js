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
    <div className="item-view">
      {doneFetching && (
        <>
          <div className="item-view-picture" aria-label="rtl-item-view-picture">
            <img src={itemDetails.picture} />
          </div>
          <div className="item-view-desc" aria-label="rtl-item-view-desc">
            Descripción del producto
            <div className="item-view-desc-content-wrppr">
              {itemDetails.description}
            </div>
          </div>
          <div className="item-view-details" aria-label="rtl-item-view-details">
            {itemDetails.condition === 'new' ? 'Nuevo' : 'Usado' }
            {' - '}
            {itemDetails.soldQuantity}
            {' '}
            vendidos
            <div className="item-view-title">
              {itemDetails.title}
            </div>
            <div className="item-view-price">
              {formatPrice(itemDetails.price)}
            </div>
            <button type="button" className="item-view-buy-btn">Comprar</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ItemView;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import formatPrice from '../utils/utils';

function Result(props) {
  const freeShippingIcon = props.freeShipping
    ? <FontAwesomeIcon className="result-info-truck-icon" icon={faTruck} />
    : '';

  return (
    <a href={`/items/${props.id}/${props.searchQuery}`}>
      <div className="result" aria-label="rtl-search-result">
        <div className="result-wrpr">
          <div className="result-thumbnail">
            <img src={props.picture} />
          </div>
          <div className="result-info">
            <div className="result-info-price">
              {formatPrice(props.price)}
              {' '}
              {freeShippingIcon}
            </div>
            <div className="result-info-title">{props.title}</div>
          </div>
          <div className="result-location">
            <div className="result-location-text">Capital Federal</div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default Result;

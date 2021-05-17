import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import formatPrice from '../utils/utils';

function Result(props) {
  const freeShippingIcon = props.freeShipping
    ? <FontAwesomeIcon className="resultInfoTruckIcon" icon={faTruck} />
    : '';

  return (
    <a href={`/items/${props.id}/${props.searchQuery}`}>
      <div className="Result" aria-label="SearchResult">
        <div className="resultWrpr">
          <div className="resultThumbnail">
            <img src={props.picture} />
          </div>
          <div className="resultInfo">
            <div className="resultInfoPrice">
              {formatPrice(props.price)}
              {' '}
              {freeShippingIcon}
            </div>
            <div className="resultInfoTitle">{props.title}</div>
          </div>
          <div className="resultLocation">
            <div className="resultLocationText">Capital Federal</div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default Result;

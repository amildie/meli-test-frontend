import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

function Breadcrumb(props) {
  const arrow = (
    <div className="breadcrumb-element-arrow">
      <FontAwesomeIcon icon={faAngleRight} />
    </div>
  );

  const formatContent = (content) => {
    const categories = (content.map((element) => <div className="breadcrumb-element">{element}</div>)).slice(0, 4);
    return categories.flatMap((c) => [arrow, c]).slice(1);
  };

  return (
    <div className="breadcrumb">
      {props.currentMode != 'INITIAL_VIEW' && (
        <div>
          {formatContent(props.content)}
        </div>
      )}
    </div>
  );
}

export default Breadcrumb;

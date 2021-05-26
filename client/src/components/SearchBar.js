import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState(props.searchQuery);
  const history = useHistory();

  const onFormSubmit = (e) => {
    e.preventDefault();
    history.push(`/items?search=${searchQuery}`);
    history.go(0);
  };

  return (
    <div className="search-bar">
      <div className="search-bar-wrppr">
        <div className="search-bar-logo" />
        <div className="search-bar-input">
          <form onSubmit={onFormSubmit} aria-label="rtl-search-bar-form">
            <input
              className="search-bar-search-input"
              aria-label="rtl-search-bar-form-input"
              value={searchQuery}
              type="text"
              placeholder="nunca dejes de buscar"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <button className="search-bar-search-btn" type="submit" aria-label="rtl-search-bar-btn" onClick={onFormSubmit}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;

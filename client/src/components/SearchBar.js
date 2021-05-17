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
    <div className="SearchBar">
      <div className="searchBarWrppr">
        <div className="searchBarLogo" />
        <div className="searchBarInput">
          <form onSubmit={onFormSubmit} aria-label="searchBarSearchForm">
            <input
              className="searchBarSearchInput"
              aria-label="searchBarSearchInput"
              value={searchQuery}
              type="text"
              placeholder="nunca dejes de buscar"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <button className="searchBarSearchBtn" type="submit" aria-label="searchBarSearchBtn">
          <FontAwesomeIcon icon={faSearch} onClick={onFormSubmit} />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;

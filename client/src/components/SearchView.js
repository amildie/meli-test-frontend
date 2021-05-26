import { useState, useEffect } from 'react';
import Result from './Result';

function SearchView(props) {
  const { searchQuery } = props;
  const [searchResults, setSearchResults] = useState([]);

  const mapItem = (item) => (
    <Result
      key={item.id}
      id={item.id}
      title={item.title}
      price={item.price}
      picture={item.picture}
      condition={item.condition}
      freeShipping={item.free_shipping}
      searchQuery={searchQuery}
    />
  );

  useEffect(() => {
    fetch(`http://localhost:3232/api/items?q=${searchQuery}`)
      .then((res) => res.json())
      .then((results) => {
        props.setBreadcrumbCallback(results.categories);
        const mappedItems = results.items.map((item) => mapItem(item));
        const mappedItemsWithSeparator = mappedItems.flatMap((mI) => [separator(), mI]).slice(1);
        setSearchResults(mappedItemsWithSeparator);
      });
  }, []);

  function separator() {
    return (
      <hr className="solid search-view-separator" />
    );
  }

  return (
    <div className="search-view">
      {searchResults}
    </div>
  );
}

export default SearchView;

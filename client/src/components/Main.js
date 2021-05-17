import { useParams, useLocation } from 'react-router-dom';
import React from 'react';
import SearchBar from './SearchBar';
import Breadcrumb from './Breadcrumb';
import SearchView from './SearchView';
import ItemView from './ItemView';

const queryString = require('query-string');

function Main() {
  const { id, fromSearch } = useParams();
  const searchQuery = queryString.parse(useLocation().search).search;
  const appState = {
    itemView: (id),
    searchView: (searchQuery),
    initialView: (!id && !searchQuery),
  };

  const [breadcrumbContent, setBreadcrumbContent] = React.useState([]);
  const setBreadcrumbCallback = (newContent) => {
    setBreadcrumbContent(newContent);
  };

  return (
    <div className="MainAppWrpr">
      <div className="MainScreenWrpr">
        <SearchBar searchQuery={searchQuery || fromSearch || ''} />
        <div className="CenterAreaWrpr">
          <Breadcrumb content={breadcrumbContent} />
          <div className="MainDataAreaWrpr">
            {appState.initialView && (
              <div />
            )}
            {appState.itemView && (
              <ItemView id={id} setBreadcrumbCallback={setBreadcrumbCallback} />
            )}
            {appState.searchView && (
              <SearchView searchQuery={searchQuery} setBreadcrumbCallback={setBreadcrumbCallback} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;

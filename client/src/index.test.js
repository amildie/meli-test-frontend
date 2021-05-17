import {
  render, screen, fireEvent, getByLabelText,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configure } from '@testing-library/dom';
import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Main from './components/Main';
import ItemView from './components/ItemView';
import SearchView from './components/SearchView';

configure({ asyncUtilTimeout: 10000 });

jest.setTimeout(10000);

test('The Main app renders correctly', async () => {
  const history = createMemoryHistory();
  const { findByLabelText, findAllByLabelText } = render(
    <Router history={history}>
      <Main />
    </Router>,
  );

  const input = await findByLabelText('searchBarSearchForm');
  expect(input).toBeInTheDocument();
});

test('The ItemView renders correctly', async () => {
  const setBreadCrumbCallback = jest.fn();
  const { findByLabelText } = render(
    <ItemView
      id="MLA901053186"
      setBreadcrumbCallback={setBreadCrumbCallback}
    />,
  );
  const picture = await findByLabelText('itemViewPicture');
  const description = await findByLabelText('itemViewDesc');
  const details = await findByLabelText('itemViewDetails');

  expect(picture).toBeInTheDocument();
  expect(description).toBeInTheDocument();
  expect(details).toBeInTheDocument();
  expect(setBreadCrumbCallback).toHaveBeenCalled();
});

test('The SearchView renders correctly', async () => {
  const setBreadCrumbCallback = jest.fn();
  const { findAllByLabelText } = render(
    <SearchView
      searchQuery="remera"
      setBreadcrumbCallback={setBreadCrumbCallback}
    />,
  );
  const results = await findAllByLabelText('SearchResult', { timeout: 10000 });
  expect(results.length === 4);
  expect(setBreadCrumbCallback).toHaveBeenCalled();
});

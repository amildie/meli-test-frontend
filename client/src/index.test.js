import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { configure } from '@testing-library/dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import React from 'react';
import Main from './components/Main';
import ItemView from './components/ItemView';
import SearchView from './components/SearchView';

configure({ asyncUtilTimeout: 5000 });

test('The Main app renders correctly and can perform searches', async () => {
  const history = createMemoryHistory();
  history.push = jest.fn();

  const { findByLabelText } = render(
    <Router history={history}>
      <Main />
    </Router>,
  );

  const input = await findByLabelText('rtl-search-bar-form-input');
  const searchBtn = await findByLabelText('rtl-search-bar-btn');
  userEvent.type(input, 'monitor');
  userEvent.click(searchBtn);
  expect(history.push).toBeCalledWith('/items?search=monitor');
});

test('The ItemView renders correctly', async () => {
  const setBreadCrumbCallback = jest.fn();
  const { findByLabelText } = render(
    <ItemView
      id="MLA901053186"
      setBreadcrumbCallback={setBreadCrumbCallback}
    />,
  );
  const picture = await findByLabelText('rtl-item-view-picture');
  const description = await findByLabelText('rtl-item-view-desc');
  const details = await findByLabelText('rtl-item-view-details');

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
  const results = await findAllByLabelText('rtl-search-result', { timeout: 10000 });
  expect(results.length === 4);
  expect(setBreadCrumbCallback).toHaveBeenCalled();
});

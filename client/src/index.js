import React from 'react';
import ReactDOM from 'react-dom';
import './sass/app.scss';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Main from './components/Main';

const customHistory = createBrowserHistory();

ReactDOM.render(
  <Router history={customHistory}>
    <Route exact path={['/items/:id', '/items/:id/:fromSearch', '/', '/items']}>
      <Main />
    </Route>
  </Router>,
  document.getElementById('root'),
);

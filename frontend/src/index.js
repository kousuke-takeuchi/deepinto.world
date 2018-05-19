import './index.pug';
import './index.styl';
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';

import client from './api';
import App from './Core/App.jsx';


ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app'),
);

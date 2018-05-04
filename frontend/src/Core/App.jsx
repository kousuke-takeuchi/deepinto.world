import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory';

import TopPage from '../Pages/TopPage.jsx';
import ArticlesPage from '../Pages/ArticlesPage.jsx';
import ArticleSinglePage from '../Pages/ArticleSinglePage.jsx';

import Styles from './App.styl';


const history = createBrowserHistory();


class AppBody extends React.Component {
  render() {
    return (
      <div>
        <Route exact path='/' component={TopPage} />
        <Route exact path='/articles' component={ArticlesPage} />
        <Route exact path='/articles/:articleId' component={ArticleSinglePage} />
      </div>
    );
  }
}

class AppFooter extends React.Component {
  render() {
    return (
      <footer className={Styles.footer}>
        &copy; takeuchi.host, All right reserved.
      </footer>
    );
  }
}

class AppRoot extends React.Component {
  render() {
    return (
      <div className={Styles.root}>
        <div className={Styles.body}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter histroy={history}>
        <AppRoot>
          <AppBody />
          <AppFooter />
        </AppRoot>
      </BrowserRouter>
    );
  }
}

import React from 'react';
import { graphql } from 'react-apollo';

import GetPostsQuery from '../Queries/GetPostsQuery';


class App extends React.Component {
  render () {
    console.log(this.props.data.loading);
    console.log(this.props.data.getPosts);
    return <p>Hello React!</p>;
  }
}

export default graphql(GetPostsQuery)(App);

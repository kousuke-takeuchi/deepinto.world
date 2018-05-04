import React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom'

import GetPostsQuery from '../Queries/GetPostsQuery';


class Articles extends React.Component {
  render() {
    return (
      <div>
        <h1>Articles</h1>
        <ul>
          <li><Link to='/'>Top</Link></li>
          <li><Link to='/articles'>Articles</Link></li>
        </ul>
      </div>
    );
  }
}

export default graphql(GetPostsQuery)(Articles);

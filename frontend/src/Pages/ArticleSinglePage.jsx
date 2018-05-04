import React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom'

import GetPostsQuery from '../Queries/GetPostsQuery';


class ArticleSinglePage extends React.Component {
  render() {
    console.log(this.props);
    console.log(this.props.match.params);
    return (
      <div>
        <h1>ArticleSinglePage</h1>
        <ul>
          <li><Link to='/'>Top</Link></li>
          <li><Link to='/articles'>Articles</Link></li>
          <li><Link to='/articles/10'>ArticleSingle</Link></li>
        </ul>
      </div>
    );
  }
}

export default graphql(GetPostsQuery)(ArticleSinglePage);

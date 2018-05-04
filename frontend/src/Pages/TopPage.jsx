import React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom'

import Introduction from '../Components/Introduction.jsx';
import Portfolio from '../Components/Portfolio.jsx';
import Contact from '../Components/Contact.jsx';


export default class TopPage extends React.Component {
  render() {
    return (
      <div>
        <Introduction />
        <Portfolio />
        <Contact />
      </div>
    );
  }
}

import React from 'react';

import Title from './Title.jsx';
import { Row } from './Layout.jsx';
import { ExternalLinkText } from './Text.jsx';

import Styles from './Contact.styl';


export default class Contact extends React.Component {
  render() {
    return (
      <div className={Styles.Contact}>
        <Title>Contact</Title>
      </div>
    )
  }
}

import React from 'react';

import Title from './Title.jsx';
import { Row } from './Layout.jsx';
import { ExternalLinkText } from './Text.jsx';

import Styles from './Portfolio.styl';


export default class Portfolio extends React.Component {
  render() {
    return (
      <div className={Styles.Portfolio}>
        <Title>Portfolio</Title>
        <Row>
          ・<ExternalLinkText href="https://github.com/kousuke-takeuchi/takeuchi.host">react-appsync-blog</ExternalLinkText>
          ・<ExternalLinkText href="https://github.com/kousuke-takeuchi/selfolio">selfolio</ExternalLinkText>
        </Row>
      </div>
    )
  }
}

import React from 'react';
import { Link } from 'react-router-dom';

import Styles from './Text.styl';


export class Text extends React.Component {
  render() {
    return (
      <p className={Styles.text}>{this.props.children}</p>
    );
  }
}

export class LinkText extends React.Component {
  render() {
    return (
      <Link to={this.props.to} className={Styles.linkText}>{this.props.children}</Link>
    );
  }
}

export class ExternalLinkText extends React.Component {
  render() {
    return (
      <p className={Styles.linkText}>
        <a href={this.props.href} target="_blank">{this.props.children}</a>
      </p>
    );
  }
}

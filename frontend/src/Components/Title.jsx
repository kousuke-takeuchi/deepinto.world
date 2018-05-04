import React from 'react';

import Styles from './Title.styl';

console.log(Styles.titleText);


export default class Title extends React.Component {
  render() {
    return (
      <h2 className={Styles.titleText}>{this.props.children}</h2>
    );
  }
}

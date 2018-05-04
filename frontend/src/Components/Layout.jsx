import React from 'react';

import _ from 'lodash';

import Styles from './Layout.styl';


export class Row extends React.Component {
  render() {
    return (
      <div className={Styles.Row}>{ this.props.children }</div>
    );
  }
}

export class Column extends React.Component {
  constructor(props) {
    super(props);
    const { c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12 } = props;
    const flexList = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12];
    this.colStyle = 'c' + (_.indexOf(flexList, true) + 1);
    console.log(this.colStyle);
  }

  render() {
    const style = Styles[this.colStyle];
    return (
      <div className={style}>{ this.props.children }</div>
    );
  }
}

import React from 'react';

import { Row, Column } from './Layout.jsx';
import { Text } from './Text.jsx';

import Title from './Title.jsx';

import Styles from './Introduction.styl'


export default class Introduction extends React.Component {
  render() {
    return (
      <div className={Styles.Introduction}>
        <Title>Kousuke Takeuchi (竹内 宏佑)</Title>
        <Row>
          <Column c4>
            <img className={Styles.img} src={require('assets/profile.png')} />
          </Column>
          <Column c8>
            <Text>登山/水泳が好きです</Text>
            <Text>【技能】</Text>
            <Text>Python/React/Node.js/Linux/機械加工/電子回路/ML</Text>
            <Text>【経歴】</Text>
            <Text>13'-14' 株式会社スタートアウツ CTO</Text>
            <Text>14'-18' 株式会社Warrantee 取締役CTO</Text>
          </Column>
        </Row>
      </div>
    );
  }
}

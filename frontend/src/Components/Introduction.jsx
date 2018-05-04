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
            <img className={Styles.img} src="https://lh3.googleusercontent.com/-08wBXVp3LhguJL28FDmn_89VX98lBTDMr8AOrL6NlF9z5JkGyl0_xbbw_ntyrslH1jZUhYXdMEYdKPTeeihsZqxrXh9R9fJxEQT-_1Rmdqb0yDewluilAGsFQwBoKip661NCNcJIZ4ke9hzdo_eUaZAqvBdnpXAplvNtUNjpxUdDXs2gfAfHTDtVthvQliKyqANQgb5efPKILppFJMnCtrPsPCjQFOuddaUQve7YaLBfERlXwH5myicPGW3QfqS3-Qc0-mEmSvFoHJMwyU1c5bQTj6BeF1IXd6jPAGqexvj2We7t31-B6DbrdxVxql-RQ-5pVS_th52gYBOKRg1_p-LJrRYDUN5KrjbkGNND7mb0X8Rm6sja7oGKw1dN_ntHhYI93BTEWhKNoa-UDwjLf0ofFihEG-dSQACtBGF-892SH6FiSONA0JP3CHp91Oo9bT1Fm9_C59LyoaDd4FYO9zZpiFNDKY4bNFKRhOWeoQ9kwTiAtJLwVbuzmFcENfyvuiWQYx_Z7zsIPWQ90stbEt9WcjMPpmiavJo4OmJ-qqfBWT6u_fGcZsPossUWu90T8ZjZHWsfNNFtosXf80n-oNfDjNM41lusDS943M=w1568-h1044-no" />
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

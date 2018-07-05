# Google Home Mini買ったので、Google Analyticsのレポートなど仕事のアシスタントをやらせてみる
タグ: #AI #GoogleHome #GCP

最近遅ればせながらGoogle Homeを購入しました。

元々自宅にはプライベート用のAmazon Echoがあって、音楽聞いたりくらいしか活用していませんでした。
というのも、Alexaのアプリケーションを作成してみたりしたのですが、プロジェクトセットアップの面倒さ(Alexaプロジェクト + データ処理用のAWS Lambda作成)で途中棄権してしまい、かつこちらから話しかけないと答えてくれないのがとても活用範囲狭いと感じていたので、結局スキル作成には至らない理由でした。

ただ、最近Google Homeでは、バックエンドでスキルを起動させると自発的に発言してくれることを知り、速攻Googleストアサイトでポチりました。

こういう音声ロボで一番憧れだったのが、Marvelの映画「アイアンマン」で、兵器会社社長のトニー・スタークがAIロボ「J.A.R.V.I.S. (ジャービス)」に仕事のサポートを任せていて、ジャービスが自分からトニースタークに話かけて会話しているところでした。


![](https://d2mxuefqeaa7sj.cloudfront.net/s_95A5CDA742288BE312CF838748719410D4C69629469E527C5D88891CF590244D_1525933125219_giphy.gif)


というわけで、普段の仕事でのルーチンワークをGoogleHomeにやらせてみたいと思います。

**仕事で毎日チェックしていること**

  - メール
  - Google Analytics
  - NewRelicのエラーレポート
  - Trelloの本日までの課題

メールやTrelloは、作業を進めるためにブラウザからページを開く必要がありますが、GAやNewRelicは確認するだけなので、ページを開かずに音声で伝えてくれれば充分です。


## INDEX

本連載記事では、

  1. GoogleHomeのセットアップと、Actions on Google(AoG)設定
  2. AoGとDialogflowを連携する
  3. Google Analytics APIを叩いてGoogleHomeでレポートを読み上げる
  4. NewRelic APIを叩いてGoogleHomeでレポートを読み上げる

について記載していきます。


## GoogleHomeのセットアップと、Actions on Google(AoG)設定
## AoGとDialogflowを連携する
## Google Analytics APIを叩いてGoogleHomeでレポートを読み上げる
## NewRelic APIを叩いてGoogleHomeでレポートを読み上げる

参考文献

- Actions on Google/Dialogflow : https://qiita.com/syarihu/items/53ea1a65f481f8121109
- GoogleAnalytics API : https://developers.google.com/analytics/devguides/reporting/core/v3/quickstart/service-py?hl=ja
- NewRelic API : http://new-relic-api.readthedocs.io/en/develop/toc.html


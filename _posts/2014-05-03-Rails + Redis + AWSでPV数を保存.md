---
layout: post
title:  "Rails + Redis + AWSでPV数を保存"
date: 2014-05-03 18:22:00 +0900
categories: Redis Rails AWS
---

AWS上で動くRailsアプリのページビューを保存する方法について書いていきます。
今回は基本的なことのみ書きますが、例えばブログのデイリーPVランキング、個別ページのPV数の推移グラフの作成などに応用出来ます。

### RedisをAWSに追加
AWSには、 **ElastiCache** というRedisやMemcachedなどのNoSQL専用のサービスがあります。
新規Redisインスタンスの作成手順は簡単なので、他のサイトの記事を参考にしてRedisを追加してみてください。

僕は下のサイトを参考にしました
[Using AWS ElastiCache for Redis With AWS OpsWorks](http://aws.typepad.com/aws/2013/09/using-aws-elasticache-for-redis-with-aws-opsworks.html?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+AmazonWebServicesBlog+(Amazon+Web+Services+Blog))

RedisをAWSに追加して、インスタンスの詳細画面に移動してください。

![elasticache-instance-details](https://dl.dropboxusercontent.com/u/39427047/images/Qiita/ElastiCache_Management_Console.png)

RailsでRedisを使う際に、画面のPortとEndpointを使用するので、Railsの環境変数に追加しておきましょう。

```rb
# config/environments/production.rb
ENV["REDIS"] = "xxxx.xxxx.chache.amazonaws.com:6379" # Endpoint + Port
```

AWSで追加したRedisは、AWSのRailsインスタンスからしか接続できません。従って、ローカルからはElastiCacheのRedisに接続することが出来ないので、もしAWSではなくローカルでRedisを使いたい場合は、以下のようにRedisをインストール、設定してください。

1\. Redisのインストール (Mac)

```sh
$ brew install redis
$ redis-server
```

2\. Railsの環境変数に追加

```ruby:config/environments/development.rb
ENV["REDIS"] = "localhost:6379"
```

### RailsでRedisを使うための設定
RailsでRedisを扱うためにgemを追加します

```rb
# Gemfile
gem 'redis'
```

```sh
$ bundle install
```

initializerフォルダに、Redisの初期設定を追加します。

```rb
# config/initializers/redis.rb
require 'redis'

uri = URI.parse(ENV["REDIS"])
REDIS = Redis.new(host: uri.host, port: uri.port)
```

これで、REDISという変数をRailsから呼び出すことによって、Redisを使えるようになりました。

### RedisにPV数を保存
例えば、CMSアプリケーション(ブログなど)で使う場合を考えます。
Postモデルがあって、PostsControllerからページの操作をするとします。

PostControllerのshowメソッドで、個別ページを表示するなら、以下のコードを追加します。

```rb
# controllers/posts_controller.rb
def show
 @post = Post.find(params[:id])
 ...

 REDIS.incr "posts/daily/#{Date.today.to_s}/#{@post.id}"
end
```

REDIS.incrは、数値に1を足して保存するメソッドです。
例えば、2014年4月1日に、id=100の記事が初めて読まれたとすると、

Redisの管理するハッシュのキー: posts/daily/2014-04-01/100
に「1 (= 0 + 1)」が保存されます。

もう一度読まれた場合は、

Redisの管理するハッシュのキー: posts/daily/2014-04-01/100
に「2 (= 1 + 1)」が保存されます。

さらにもう一度読まれた場合には、

Redisの管理するハッシュのキー: posts/daily/2014-04-01/100
に「3 (= 2 + 1)」が保存されます。


このように、ページビュー毎にID別のPV数がRedisに保存されます。

###  RedisからPV数を取得

```rb
REDIS.get "posts/daily/#{Date.today.to_s}/#{@post.id}"
# => 今日のPV数

REDIS.get "posts/daily/#{Date.yesterday.to_s}/#{@post.id}"
# => 昨日のPV数
```

例えば、全ての記事に関してPV数を取得すれば、毎日の人気記事ランキングを作成出来ます。

Ex.)

```rb
@posts = Post.all
@daily_pageviews = Hash.new
today = Date.today.to_s

# 個別記事のPV数を取り出す
@posts.each do |post|
 @daily_pageviews[@post.id] = REDIS.get "posts/daily/#{today}/#{post.id}"
end

# PV数のソーティング
@daily_pageviews.sort_by{|k, v| v}

#上位10個の記事を返す
@top10_pages = @daily_pageviews[0..10]
```


### (追記) より良い方法
Redisにはソート済みセットという型が用意されています。もし月間PVランキングみたいなものを実装したいのであれば、この型を使うと自動的にランキングが出力されるので便利です。

ソート済みセットの関数「zincrby」は、「キー・数値・メンバー」を引数とし、あるメンバーにキーが存在すれば数値分だけ増やし、キーが存在しなければ数値をセットします。

例えば、「2015/1/1の記事」というメンバーに「id=10の記事」というキーがあって、「PV数が100件」といった数値があると考えると、PV数のランキングは以下のように実装できます。

```rb
def show()
  @post = Post.find(params[:id])
  ...
  # ex.) REDIS.zincrby "posts/daily/2015-01-01", "1", "10"
  #      2015年1月1日にid=10の記事の総PV数を1増やす
  REDIS.zincrby "posts/daily/#{Date.today.to_s}", 1, "#{@post.id}"
end
```

zrevrange関数は、メンバーの降順にソートされた数値の中から、指定された範囲の数値を持つキーを取得します。昇順の場合はzrange関数を使います。
このzrevrangeを使うと、PV数のランキングデータを取得するのも2行で済みます。

```rb
# PV数1位から20位までの記事を取得
ids = REDIS.zrevrange "posts/dayly/#{Date.today.to_s}", 0, 19
@posts = Post.where(id: ids)
```

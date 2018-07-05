# Webサーバーのログ情報を視覚化する
タグ: #processing #データ解析 #データビジュアライゼーション

サーバーエンジニアをやってると、シェルスクリプトでログ情報を編集してホームページなどのアクセスランクを作ることは多いと思いますが、経営者やデザイナーなどエンジニア以外の人にとっては、その（ほとんど生な）データは見ても情報を見抜きにくい上、面白くないのでアイデアがわきにくいと思います。


そこで、このつまらないサーバーログをProcessingを使ってわかりやすくネットワークグラフとして表示するプログラムを紹介します。


グラフの描画に関しては「[ビジュアライジング・データ](https://www.amazon.co.jp/%E3%83%93%E3%82%B8%E3%83%A5%E3%82%A2%E3%83%A9%E3%82%A4%E3%82%B8%E3%83%B3%E3%82%B0%E3%83%BB%E3%83%87%E3%83%BC%E3%82%BF-%E2%80%95Processing%E3%81%AB%E3%82%88%E3%82%8B%E6%83%85%E5%A0%B1%E8%A6%96%E8%A6%9A%E5%8C%96%E6%89%8B%E6%B3%95-Ben-Fry/dp/4873113784)」を参考に作成しました。


まずは、サーバーのログをProcessingで扱いやすいように整形します。


    #!/bin/bash
    log=/var/log/nginx/access.log  #path to log file
    
    # except the acccess history of me
    # then, shape it, and save as a text
    cat $log | grep -v 192.168.10.3 | cut -d ' ' -f 6 | sort | uniq -c | sort -r | grep .html | sed -r 's/.html//g' > access_rank.txt

実行結果は以下のようになります。


> ...
>       2  company message
>       2  company index
>       2  company companyinfo
>       1  update character
>       1  sitemap
>       1  site introduction index
>       1  service
>       1  ricruit
> …


今回は最近作成したNginxのサーバーのログファイルを整形したので、情報量が少なかったのです。


さて、この空白で区切られたデータを表示するプログラムを紹介していきます。

ネットワークを構成するためには「ノード」と「エッジ」が必要になります。今回は「ノード」がHTMLページ、「エッジ」が「ノード」つなぐための「線」になります。

まずは、この２つをクラスによって定義していきます。


    class Node {
      float x, y;
      float dx, dy;
      boolean fixed;
      String label;
      int count;
      
      Node(String label) {
        this.label = label;
        x = random(width);
        y = random(height);
      }
      
      void relax() {
        float ddx = 0;
        float ddy = 0;
        
        for (int j = 0; j < nodeCount; j++) {
          Node n = nodes[j];
          if (n != this) {
            float vx = x - n.x;
            float vy = y - n.y;
            float lensq = vx * vx + vy * vy;
            if (lensq == 0) {
              ddx += random(1);
              ddy += random(1);
            } else if (lensq < 100*100) {
              ddx += vx / lensq;
              ddy += vy / lensq;
            }
          }
        }
        float dlen = mag(ddx, ddy) / 2;
        if (dlen > 0) {
          dx += ddx / dlen;
          dy += ddy / dlen;
        }
      }
      
      void update() {
        if (!fixed) {
          x += constrain(dx, -5, 5);
          y += constrain(dy, -5, 5);
          
          x = constrain(x, 0, width);
          y = constrain(y, 0, height);
        }
        dx /= 2;
        dy /= 2;
      }
      
      void draw() {
        if (fixed) {
          fill(nodeColor);
          stroke(0);
          strokeWeight(0.5);
         
          String content = label + " " + count;
          float w = textWidth(content) + 10;
          float h = textAscent() + textDescent() + 4;
          ellipse(x, y, w*pow(1.06, count-1), h*pow(1.06, count+1));
          
          fill(0);
          textAlign(CENTER, CENTER);
          text(content, x, y);
        } else {
          fill(nodeColor);
          stroke(0);
          strokeWeight(0.5);
          ellipse(x, y, sqrt(count)*10, sqrt(count)*10);
        }
      }
      
      void increment() {
        count++;
      }
    }
    
    Node findNode(String label) {
      label = label.toLowerCase();
      Node n = (Node) nodeTable.get(label);
      if (n == null) {
        return addNode(label);
      }
      return n;
    }
    
    Node addNode(String label) {
      Node n = new Node(label);
      if (nodeCount == nodes.length) {
        nodes = (Node[]) expand(nodes);
      }
      nodeTable.put(label, n);
      nodes[nodeCount++] = n;
      return n;
    }
    
    class Edge {
      Node from;
      Node to;
      float len;
      int count;
      
      Edge(Node from, Node to) {
        this.from = from;
        this.to = to;
        this.len = 50;
      }
      
      void relax() {
        float vx = to.x - from.x;
        float vy = to.y - from.y;
        float d = mag(vx, vy);
        if (d > 0) {
          float f = (len -d) / (d * 3);
          float dx = f * vx;
          float dy = f * vy;
          to.dx += dx;
          to.dy += dy;
          from.dx -= dx;
          from.dy -= dy;
        }
      }
      
      void draw() {
        stroke(edgeColor);
        strokeWeight(0.35);
        line(from.x, from.y, to.x, to.y);
      }
      
      void increment() {
          count++;
        }
    }
    
    void addEdge(String fromLabel, String toLabel) {
      Node from = findNode(fromLabel);
      Node to = findNode(toLabel);
      from.increment();
      to.increment();
      
      // check whether the Edge have already existed.
      for (int i = 0; i < edgeCount; i++) {
         if (edges[i].from == from && edges[i].to == to) {
             edges[i].increment();
             return;
         }
      }
      
      Edge e = new Edge(from, to);
      e.increment();
      if (edgeCount == edges.length) {
        edges = (Edge[]) expand(edges);
      }
      edges[edgeCount++] = e;
    }


クラス内のメゾッドにrelax(), update(), draw()があり、これらがグラフを上手く表示するようにエッジやノードの位置を調節するそうです。詳しいことは他の文献を参考にしろとのことでした。
また、ビジュアライジング・データには載っていませんでしたが、アクセス数の多いページのノードを大きく表示するように自身で改良しました。

参考: [ゲーム開発のための物理シミュレーション入門―Physics for Game Developers](https://www.amazon.co.jp/exec/obidos/ASIN/427406526X/u651601f-22/)

さて、続いてエッジに先ほどのデータを追加していきます。


    void loadData() {
      reader = createReader("/path/to/access_rank.txt"); // 先ほどシェルスクリプトで整形したデータへのパス
      try {
        String line = reader.readLine();
        while (line != null) {
          String[] columns = split(line, ' ');
          String fromEdge = INDEX;
          int num = 0;
          for (String word : columns) {
            int count = 0;
            if (!word.isEmpty() && isNumeric(word)) {
              num = Integer.parseInt(word);
            } else if (!word.isEmpty() && !word.toLowerCase().contains(INDEX) && num != 0) {
              for (int i = 0; i < num; i++)
                addEdge(fromEdge, word);
              fromEdge = word;
            }
          }
        line = reader.readLine();
        }
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    
    public static boolean isNumeric(String str)  
    {  
      try  
      {  
        Integer d = Integer.parseInt(str);  
      }  
      catch(NumberFormatException nfe)  
      {  
        return false;  
      }  
      return true;  
    }

これはProcessingのsetup()関数で呼び出されます。一行ごとにページヘのパスを調べてネットワークを構成します。

プログラムの大まかな構成は上記のような感じです。あとはマウスがクリックされた時の振る舞いや、ノードの色などを決めたりするだけなので、その辺りは読み飛ばしていってもらったらいいかと思います。

最後にプログラムの全体を掲載しておきます。


    BufferedReader reader;
    
    int nodeCount;
    Node[] nodes = new Node[100];
    HashMap nodeTable = new HashMap();
    
    Node selection;
    
    int edgeCount;
    Edge[] edges = new Edge[500];
    
    static final color nodeColor = #F0C070;
    static final color selectColor = #FF3030;
    static final color fixedColor = #FF8080;
    static final color edgeColor = #000000;
    
    PFont font;
    static final String INDEX = "index";
    
    void setup() {
      size(1000, 600);
      loadData();
      font = createFont("SansSerif", 10);
      textFont(font);
      smooth();
    }
    
    void loadData() {
      reader = createReader("/path/to/access_rank.txt");
      try {
        String line = reader.readLine();
        while (line != null) {
          String[] columns = split(line, ' ');
          String fromEdge = INDEX;
          int num = 0;
          for (String word : columns) {
            int count = 0;
            if (!word.isEmpty() && isNumeric(word)) {
              num = Integer.parseInt(word);
            } else if (!word.isEmpty() && !word.toLowerCase().contains(INDEX) && num != 0) {
              for (int i = 0; i < num; i++)
                addEdge(fromEdge, word);
              fromEdge = word;
            }
          }
        line = reader.readLine();
        }
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
    
    public static boolean isNumeric(String str)  
    {  
      try  
      {  
        Integer d = Integer.parseInt(str);  
      }  
      catch(NumberFormatException nfe)  
      {  
        return false;  
      }  
      return true;  
    }
    
    void draw() {
      background(255);
      
      for (int i = 0; i < edgeCount; i++)
        edges[i].relax();
      for (int i = 0; i < nodeCount; i++)
        nodes[i].relax();
      for (int i = 0; i < nodeCount; i++)
        nodes[i].update();
      for (int i = 0; i < edgeCount; i++)
        edges[i].draw();
      for (int i = 0; i < nodeCount; i++)
        nodes[i].draw();
    }
    
    void mousePressed() {
      float closest = 20;
      for (int i = 0; i < nodeCount; i++) {
        Node n = nodes[i];
        float d = dist(mouseX, mouseY, n.x, n.y);
        if (d < closest) {
          selection = n;
          closest = d;
        }
      }
      if (selection != null) {
        if (mouseButton == LEFT) {
          selection.fixed = true;
        } else if (mouseButton == RIGHT) {
          selection.fixed = false;
        }
      }
    }
    
    void mouseDragged() {
      if (selection != null) {
        selection.x = mouseX;
        selection.y = mouseY;
      }
    }
    
    void mouseRelesed() {
      selection = null;
    }
    
    class Node {
      float x, y;
      float dx, dy;
      boolean fixed;
      String label;
      int count;
      
      Node(String label) {
        this.label = label;
        x = random(width);
        y = random(height);
      }
      
      void relax() {
        float ddx = 0;
        float ddy = 0;
        
        for (int j = 0; j < nodeCount; j++) {
          Node n = nodes[j];
          if (n != this) {
            float vx = x - n.x;
            float vy = y - n.y;
            float lensq = vx * vx + vy * vy;
            if (lensq == 0) {
              ddx += random(1);
              ddy += random(1);
            } else if (lensq < 100*100) {
              ddx += vx / lensq;
              ddy += vy / lensq;
            }
          }
        }
        float dlen = mag(ddx, ddy) / 2;
        if (dlen > 0) {
          dx += ddx / dlen;
          dy += ddy / dlen;
        }
      }
      
      void update() {
        if (!fixed) {
          x += constrain(dx, -5, 5);
          y += constrain(dy, -5, 5);
          
          x = constrain(x, 0, width);
          y = constrain(y, 0, height);
        }
        dx /= 2;
        dy /= 2;
      }
      
      void draw() {
        if (fixed) {
          fill(nodeColor);
          stroke(0);
          strokeWeight(0.5);
         
          String content = label + " " + count;
          float w = textWidth(content) + 10;
          float h = textAscent() + textDescent() + 4;
          ellipse(x, y, w*pow(1.06, count-1), h*pow(1.06, count+1));
          
          fill(0);
          textAlign(CENTER, CENTER);
          text(content, x, y);
        } else {
          fill(nodeColor);
          stroke(0);
          strokeWeight(0.5);
          ellipse(x, y, sqrt(count)*10, sqrt(count)*10);
        }
      }
      
      void increment() {
        count++;
      }
    }
    
    Node findNode(String label) {
      label = label.toLowerCase();
      Node n = (Node) nodeTable.get(label);
      if (n == null) {
        return addNode(label);
      }
      return n;
    }
    
    Node addNode(String label) {
      Node n = new Node(label);
      if (nodeCount == nodes.length) {
        nodes = (Node[]) expand(nodes);
      }
      nodeTable.put(label, n);
      nodes[nodeCount++] = n;
      return n;
    }
    
    class Edge {
      Node from;
      Node to;
      float len;
      int count;
      
      Edge(Node from, Node to) {
        this.from = from;
        this.to = to;
        this.len = 50;
      }
      
      void relax() {
        float vx = to.x - from.x;
        float vy = to.y - from.y;
        float d = mag(vx, vy);
        if (d > 0) {
          float f = (len -d) / (d * 3);
          float dx = f * vx;
          float dy = f * vy;
          to.dx += dx;
          to.dy += dy;
          from.dx -= dx;
          from.dy -= dy;
        }
      }
      
      void draw() {
        stroke(edgeColor);
        strokeWeight(0.35);
        line(from.x, from.y, to.x, to.y);
      }
      
      void increment() {
          count++;
        }
    }
    
    void addEdge(String fromLabel, String toLabel) {
      Node from = findNode(fromLabel);
      Node to = findNode(toLabel);
      from.increment();
      to.increment();
      
      // check whether the Edge have already existed.
      for (int i = 0; i < edgeCount; i++) {
         if (edges[i].from == from && edges[i].to == to) {
             edges[i].increment();
             return;
         }
      }
      
      Edge e = new Edge(from, to);
      e.increment();
      if (edgeCount == edges.length) {
        edges = (Edge[]) expand(edges);
      }
      edges[edgeCount++] = e;

そして、実行した結果がこちらです。


![](https://d2mxuefqeaa7sj.cloudfront.net/s_1324AA08944382DCDEE2CEF8943533B7A24CB1C56B359DDDD22D3EAC086E9BBA_1525949265422_20131109170829.png)


やっぱりデータが少ないので、少しさびしい印象を与えますね^^;
今回はホームページのアクセスログを解析しました。なのでノードの数は少なくて観やすかったと思います。（ページの数が50を超えるような大規模なホームページの場合はかなり見難いと思いますが）
このように、ノード数が少ないデータを可視化したいのなら、Processingでネットワークグラフを作成してみるといいかと思います。


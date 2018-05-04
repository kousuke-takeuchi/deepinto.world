const path = require('path');
const webpack = require('webpack');


const env = process.env.NODE_ENV || 'develop';
const dev = !(env === 'production');

module.exports = {
  entry: path.join(__dirname, 'src/main.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  mode: dev ? 'development' : 'production',
  devServer: {
    contentBase: 'public',
    port: 3000,
    inline: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react'],

          }
        }
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!stylus-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV: require(path.join(__dirname, './env/' + env + '.json'))
    })
  ],
  devtool: 'source-map'
};

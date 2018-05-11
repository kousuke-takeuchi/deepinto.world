const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const S3Uploader = require('webpack-s3-uploader')

const SRC_DIR = 'src';
const DEST_DIR = 'dist';

const rimraf = require('rimraf');
rimraf.sync(path.join(DEST_DIR, '**/*'));

const env = process.env.NODE_ENV || 'develop';
const dev = !(env === 'master');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('[name].css');
const extractHTML = new ExtractTextPlugin('[name].html');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const AWS_CONFIG = require('./config.json');

module.exports = {
  entry: path.join(__dirname, SRC_DIR, '/main.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  stats: {
    colors: true
  },
  devtool: dev ? 'source-map' : false,
  mode: dev ? 'development' : 'production',
  devServer: {
    contentBase: DEST_DIR,
    host: '0.0.0.0',
    port: 3000,
    inline: true,
    disableHostCheck: true
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: extractHTML.extract({
          use: [
            'html-loader',
            {
              loader: 'pug-html-loader',
              options: {
                pretty: true,
                exports: false
              }
            }
          ]
        })
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react']
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
    new CopyWebpackPlugin([
      { context: 'src', from: '**/*.html' },
    ]),
    extractHTML,
    new webpack.DefinePlugin({
      ENV: require(path.join(__dirname, './env/' + env + '.json'))
    }),
    dev ? Boolean : new UglifyJSPlugin({ sourceMap: dev }),
    dev ? Boolean : new S3Uploader({
      s3Options: {
        accessKeyId: AWS_CONFIG.accessKeyId,
        secretAccessKey: AWS_CONFIG.secretAccessKey,
        region: AWS_CONFIG.region
      },
      s3UploadOptions: {
        Bucket: 'takeuchi.host'
      },
    })
  ]
};

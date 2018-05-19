import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import S3Uploader from 'webpack-s3-uploader';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

const dependencies = Object.keys(require('./package.json').dependencies);

const SRC_DIR = path.resolve('src');
const DEST_DIR = path.resolve('dist');

import rimraf from 'rimraf';
rimraf.sync(path.join(DEST_DIR, '**/*'));
rimraf.sync(path.join(SRC_DIR, '**/*.css.json'));

import ExtractTextPlugin from 'extract-text-webpack-plugin';
const extractCSS = new ExtractTextPlugin('[name].css');
const extractHTML = new ExtractTextPlugin('[name].html');

import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const production = process.env.NODE_ENV === 'master';
const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'staging';

import AWS_CONFIG from './config.json';
const s3Uploader = new S3Uploader({
  s3Options: {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey,
    region: AWS_CONFIG.region
  },
  s3UploadOptions: {
    Bucket: production ? 'intodeep.world' : 'staging.intodeep.world'
  },
});

module.exports = {
    entry: {
        'index': path.join(SRC_DIR, 'index.js'),
        'dependencies': dependencies
    },
    output: {
        path: DEST_DIR,
        filename: '[name].js',
        publicPath: ''
    },
    devtool: development ? 'source-map' : false,
    stats: {
        colors: true
    },
    devServer: {
        contentBase: DEST_DIR,
        compress: true,
        host: '0.0.0.0',
        port: 3000
    },
    resolve: {
        modules: [SRC_DIR, "node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.(jpg|png|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: 'src/assets/',
                            publicPath: './assets',
                            outputPath: 'assets/',
                            useRelativePath: false
                        }
                    }
                ]
            },
            {
                test: /\.pug$/,
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
            },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: development,
                                modules: true,
                                importLoaders: 1,
                                localIdentName: '[local]_[md5:hash:hex:5]',
                                minimize: production
                            }
                        },
                        {
                            loader: 'stylus-loader',
                            options: {
                                sourceMap: development,
                                use: [require('nib')()],
                                import: ['~nib/lib/nib/index.styl'],
                                preferPathResolver: 'webpack'
                            }
                        }
                    ]
                })
            },
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader'
              }
            }
        ]
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /react|react-dom/,
            name: "dependencies",
            chunks: "initial",
            enforce: true
          }
        }
      }
    },
    plugins: [
        new CopyWebpackPlugin([
            { context: 'src', from: '**/*.html' },
        ]),
        new webpack.EnvironmentPlugin(),
        extractCSS,
        extractHTML,
        new webpack.DefinePlugin({
          ENV: require(path.join(__dirname, './env/' + process.env.NODE_ENV + '.json'))
        }),
        production ? new UglifyJSPlugin({ sourceMap: development }) : Boolean,
        production ? s3Uploader : Boolean,
        new HtmlWebpackPlugin({
          title: 'index.html',
          template: path.join(SRC_DIR, 'index.pug'),
        }),
        new HardSourceWebpackPlugin()
    ]
};

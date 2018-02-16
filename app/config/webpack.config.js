const path = require('path');
const process = require('process');
const webpack = require('webpack');
const babelConfig = require('./babel.config');
const cssConfig = require('./css.config');
const sassConfig = require('./sass.config');
const postcssConfig = require('./postcss.config');
const manifest = require('../.dll/manifest.json');

function config(options){
  const conf = {
    mode: process.env.NODE_ENV,
    entry: {
      app: path.join(__dirname, '../src/app.js')
    },
    module: {
      rules: [
        { // react & js
          test: /^.*\.js$/,
          use: [babelConfig],
          exclude: /(dll\.js|appInit\.js|jquery|node_modules)/
        },
        {
          test: /(dll\.js|appInit\.js|jquery)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]_[hash].[ext]',
                outputPath: 'script/'
              }
            }
          ]
        },
        { // sass
          test: /^.*\.sass$/,
          use: ['style-loader', cssConfig, postcssConfig, sassConfig]
        },
        { // css
          test: /^.*\.css$/,
          use: ['style-loader', 'css-loader']
        },
        { // 图片
          test: /^.*\.(jpg|png|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 3000,
                name: '[name]_[hash].[ext]',
                outputPath: 'image/',
              }
            }
          ]
        },
        { // 矢量图片 & 文字
          test: /^.*\.(eot|svg|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]_[hash].[ext]',
                outputPath: 'file/'
              }
            }
          ]
        },
        { // pug
          test: /^.*\.pug$/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: process.env.NODE_ENV === 'development',
                name: '[name].html'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // dll
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: manifest
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  };

  /* 合并 */
  conf.plugins = conf.plugins.concat(options.plugins);                      // 合并插件
  conf.output = options.output;                                             // 合并输出目录
  if('devtool' in options){                                                 // 合并source-map配置
    conf.devtool = options.devtool;
  }

  return conf;
}

module.exports = config;
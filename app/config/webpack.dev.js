/* 开发环境 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config');

/* 合并配置 */
module.exports = config({
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'script/[name].js',
    chunkFilename: 'script/[name]_chunk.js'
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    // html模板
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: path.join(__dirname, '../src/index.pug')
    })
  ]
});
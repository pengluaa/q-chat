'use strict';
const path = require('path');
const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  mode: "production", //生产环境
  target: 'node',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  plugins: [
      new webpack.IgnorePlugin(/uws/),
      new CleanWebpackPlugin()
  ],

  optimization: {
    minimize: true
  },
  
  module: {
    rules: [ //设置处理js文件的loader
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
};
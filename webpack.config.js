const webpack = require('webpack')
const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    'app': [
      'babel-polyfill',
      './index'
    ]
  },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        libraryTarget:'umd'
    },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  }
}

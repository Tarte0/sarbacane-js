const webpack = require('webpack')
const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    'app': [
      'babel-polyfill',
      './sarbacane'
    ]
  },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        libraryTarget:'umd',
        library: "true"
    },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  }
};

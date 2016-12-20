var webpack = require('webpack')

module.exports = {
  entry: './tests/index.js',
  output: {
    path: './dist/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map'
};
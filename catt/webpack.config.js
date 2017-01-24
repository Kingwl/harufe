var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
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
  plugins: [new HtmlWebpackPlugin({
    filename: 'index.html'
    , template: 'static/index.html'
  })],
  devtool: 'source-map'
}

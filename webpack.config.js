const path = require('path')
// const env = process.env.NODE_ENV
const terserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry:{
    index: './src/index.js',
    background: './src/background.js'
  },
  plugins: [
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimizer: [
      new terserPlugin(),
      new OptimizeCSSAssetsPlugin({}),
    ]
  },
  module: {
    rules: [
      {test: /\.[le]|[c]ss$/,use: ['style-loader', 'css-loader', "postcss-loader", 'less-loader']}
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].js'
  }
}
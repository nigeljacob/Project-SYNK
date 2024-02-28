const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve .js and .jsx files
    fallback: {
      fs: false, // Disable 'fs' module in browser environment
      path: require.resolve('path-browserify'), // Use 'path-browserify' as fallback for 'path'
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  }
};

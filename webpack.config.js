const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react'
    }
  },
  output: {
    path: path.resolve(__dirname, 'release'),
    filename: 'react-form-validation.js',
    libraryTarget: 'umd',
    library: 'React Form Validation'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}

/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/renderer.tsx',
  target: 'electron-renderer', // For production build? Need to do more research. Web works for browser and electron. electron-renderer only works for web.
  //target: 'web',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist/renderer.js'),
    historyApiFallback: true,
    compress: true,
    port: 9000,
    hot: true,
    publicPath: '/',
    liveReload: false
  },
  resolve: {
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.scss'],
    mainFields: ['main', 'module', 'browser'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './electron/index.html'
    })
  ],
  externals:{
    "sequelize": "require('sequelize')",
    sqlite3: 'commonjs sqlite3'
  },
};
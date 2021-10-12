const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.s[ac]ss$/i,
  use: [
    'style-loader',
    'css-loader',
    'sass-loader',
  ]
});

console.log(__dirname)
module.exports = {
  target: 'electron-renderer', 
  devtool: 'source-map',
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    transportMode: 'ws', 
    injectClient: false,
    overlay: true
  },
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.scss']
  }
};

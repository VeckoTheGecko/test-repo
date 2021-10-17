/* eslint-disable @typescript-eslint/no-var-requires */
const electronConfigs = require('./webpack.electron.js');
const reactConfigs = require('./webpack.react.js');
//const preloadConfigs = require('./webpack.preload')

module.exports = [
  electronConfigs,
  reactConfigs,
  //preloadConfigs
];
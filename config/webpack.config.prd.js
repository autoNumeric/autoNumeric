/* global module, require */

const webpack = require('webpack');
const baseConfig = require('./webpack.config.base.js');

const config = Object.create(baseConfig);
config.devtool = 'source-map';
config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin({
        compressor: { warnings: false },
    }),
];

module.exports = config;

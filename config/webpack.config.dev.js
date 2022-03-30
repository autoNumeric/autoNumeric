/* global module, require */

const webpack           = require('webpack');
const merge             = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base.js');
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    mode   : 'development',
    // cf. https://webpack.js.org/configuration/devtool/
    devtool: 'cheap-source-map',
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        // new FriendlyErrorsPlugin(),
    ],
});

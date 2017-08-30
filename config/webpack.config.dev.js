/* global module, require */

const webpack           = require('webpack');
const merge             = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base.js');
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"',
            },
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        // new FriendlyErrorsPlugin(),
    ],
});

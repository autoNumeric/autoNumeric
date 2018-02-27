// This is the webpack config used for unit tests.

var webpack           = require('webpack');
var merge             = require('webpack-merge');
var baseWebpackConfig = require('./webpack.config.base.js');

var webpackConfig = merge(baseWebpackConfig, {
    mode   : 'development',
    // Use inline sourcemap for karma-sourcemap-loader
    devtool: '#inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"testing"',
            },
        }),
    ],
});

// No need for app entry during tests
delete webpackConfig.entry;

module.exports = webpackConfig;

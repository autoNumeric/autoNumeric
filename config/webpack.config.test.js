// This is the webpack config used for unit tests.

const merge             = require('webpack-merge').default;
const baseWebpackConfig = require('./webpack.config.base.js');

const webpackConfig = merge(baseWebpackConfig, {
    mode   : 'development',
    // Use inline sourcemap for karma-sourcemap-loader
    devtool: 'inline-source-map',
    optimization: {
        splitChunks: false, //TODO Remove this at one point, when karma-webpack is fixed (cf. https://stackoverflow.com/a/70778102/2834898). Also, this might be useful if chunks are needed at some point: https://github.com/ryanclark/karma-webpack/issues/493#issuecomment-823766082
    },
});

// No need for app entry during tests
delete webpackConfig.entry;

module.exports = webpackConfig;

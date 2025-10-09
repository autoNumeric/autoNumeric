// This is the webpack config used for unit tests.

// Inheriting from the base config caused problems (had to delete nearly all sections to make unit test coverage reporting to work), 
// The following config is enough.
//
// const merge             = require('webpack-merge').default;
// const baseWebpackConfig = require('./webpack.config.base.js');

const webpackConfig = {  // merge(baseWebpackConfig, {
    module: {
        rules: [
            {
                // exclude tests from coverage report
                test: /\.(spec|test)\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                // include code
                test: /\.js$/,
                exclude: /\.(spec|test)\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['istanbul'],
                        },
                    },
                ],
            },
        ],
    },
    mode: 'development',
    // Use inline sourcemap for karma-sourcemap-loader
    devtool: 'inline-source-map',
};

// No need for app entry during tests
// delete webpackConfig.entry;

module.exports = webpackConfig;

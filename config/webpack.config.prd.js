/* global module, require */

const path              = require('path');
const webpack           = require('webpack');
const merge             = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base.js');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

// Configuration for building the library
const webpackConfig = merge(baseWebpackConfig, {
    module : {
        rules: [ // Only activate the linting when building for the production
            {
                test   : /\.js$/,
                loader : 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter'),
                },
            },
        ],
    },
    devtool: '#source-map',
    output: {
        libraryTarget: 'umd',
        library      : 'AutoNumeric',
        filename     : 'autoNumeric.min.js',
        path         : resolve('dist'),
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress : {
                warnings: false,
            },
            sourceMap: true,
        }),
    ],
});

// Compress the library
const CompressionWebpackPlugin = require('compression-webpack-plugin');
webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
        asset    : '[path].gz[query]',
        algorithm: 'gzip',
        test     : new RegExp('\\.(js)$'),
        threshold: 10240,
        minRatio : 0.8,
    })
);

// Analyze the library file sizes
const showBundleAnalyzer = false; // Set to `true` to automatically launch the bundle analyzer in the browser after the compilation
if (showBundleAnalyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;

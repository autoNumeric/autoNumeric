/* global module, require, __dirname */

const path = require('path');
const merge = require('webpack-merge').default;
const baseWebpackConfig = require('./webpack.config.base.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const version = require('../package.json').version;

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

// Configuration for building the library
const webpackConfig = merge(baseWebpackConfig, {
    mode   : 'production',
    module : {
        rules: [ // Only activate the linting when building for the production
            {
                /* test   : /\.js$/,
                // loader : 'eslint-loader', // Deprecated in favor of eslint-webpack-plugin
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                /* options: {
                    formatter: require('eslint-friendly-formatter'),
                }, */
            },
        ],
    },
    optimization: {
        minimizer   : [
            new UglifyJsPlugin({
                cache        : true,
                parallel     : true,
                sourceMap    : true,
                uglifyOptions: {
                    nameCache: {},
                    ie8      : false,
                    safari10 : true,
                    compress : { // see https://github.com/mishoo/UglifyJS2#compress-options
                        dead_code    : true,
                        drop_debugger: true,
                        keep_fnames  : false,
                        passes       : 4,
                    },
                    output   : { // See https://github.com/mishoo/UglifyJS2#output-options
                        beautify: false,
                        comments: false,
                        preamble: `/**
 * AutoNumeric.js v${version}
 * © 2009-2023 Alexandre Bonneau, Robert J. Knothe
 * Released under the MIT License.
 */`
                    },
                    mangle   : { // see https://github.com/mishoo/UglifyJS2#mangle-options
                        keep_fnames: false,
                        toplevel   : true,
                    },
                },
            }),
        ],
    },
    devtool: 'source-map',
    output : {
        libraryTarget: 'umd',
        library      : 'AutoNumeric',
        filename     : 'autoNumeric.min.js',
        path         : resolve('dist'),
        globalObject : 'this',
    },
    plugins: [
        new ESLintPlugin(),
        new CompressionWebpackPlugin(), // Compress the library
    ],
});

// Analyze the library file sizes
const showBundleAnalyzer = false; // Set to `true` to automatically launch the bundle analyzer in the browser after the compilation
if (showBundleAnalyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;

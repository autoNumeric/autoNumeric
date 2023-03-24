/* global module, require, __dirname */

const path = require('path');
const merge = require('webpack-merge').default;
const baseWebpackConfig = require('./webpack.config.base.js');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const version = require('../package.json').version;
const info = require('../package.json');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

function lastYear() {
    const currentYear = new Date().getFullYear();
    return Math.max(2023, currentYear);
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
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel : true,
                extractComments: false,
                terserOptions: {
                    sourceMap: true,
                    ie8: false,
                    safari10 : true,
                    compress: {
                        // dead_code    : true,
                        // drop_debugger: true,
                        // keep_fnames: false,
                        passes       : 1,
                        module       : true,
                        // eslint-disable-next-line camelcase
                        keep_infinity: true,
                    },
                    output   : {
                        beautify: false,
                        comments: false,
                        preamble: `/**
 * AutoNumeric.js v${version}
 * © 2016-${lastYear()} ${info.author}
 * © 2009-2016 ${info.contributors[0]}
 * Released under the MIT License.
 * See ${info.homepage}
 */`,
                    },
                    mangle: {
                        // eslint-disable-next-line camelcase
                        keep_fnames: false,
                        toplevel   : true,
                        // properties: { //TODO Find a way to mangle properties while still having the library work as expected
                        //     regex: /^_/, // Needed to mangle the private AutoNumeric properties and functions
                        // },
                        // module: true,
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

/* global module, require */

const path              = require('path');
const webpack           = require('webpack');
const merge             = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base.js');
const UglifyJsPlugin    = require('uglifyjs-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

// Configuration for building the library
const webpackConfig = merge(baseWebpackConfig, {
    mode   : 'production',
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
 * AutoNumeric.js - http://autonumeric.org
 *
 * @authors    Bob Knothe, Alexandre Bonneau
 * @copyright  2009 Robert J. Knothe
 *
 * @license    Released under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sub license, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */`
                    },
                    mangle   : { // see https://github.com/mishoo/UglifyJS2#mangle-options
                        keep_fnames: false,
                        toplevel   : true,
                    },
                }
            }),
        ],
    },
    devtool: 'source-map',
    output : {
        libraryTarget: 'umd',
        library      : 'AutoNumeric',
        filename     : 'autoNumeric.min.js',
        path         : resolve('dist'),
    },
    plugins: [],
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

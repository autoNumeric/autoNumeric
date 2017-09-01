/* global module */

var path = require('path');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry  : {
        app: './src/main.js',
    },
    module : {
        rules: [
            {
                test   : /\.js$/,
                loader : 'babel-loader',
                exclude: /(bower_components|node_modules)/,
                include: [resolve('src'), resolve('test')],
            },
        ],
    },
    output: {
        libraryTarget: 'umd',
        library: 'AutoNumeric',
        filename: 'autoNumeric.js',
        path: resolve('dist'),
    },
    resolve: {
        extensions: [
            '.js',
        ],
    },
};

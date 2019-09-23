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
    output : {
        libraryTarget: 'umd', // For info, using `var` instead of `umd` generates a cleaner dist file
        libraryExport: 'default', // This option removes the `.default` after the build (see https://github.com/webpack/webpack/issues/3929)
        library      : 'AutoNumeric',
        filename     : 'autoNumeric.js',
        path         : resolve('dist'),
        globalObject : 'this',
    },
    resolve: {
        extensions: [
            '.js',
        ],
    },
};

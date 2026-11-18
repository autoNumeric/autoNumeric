/* global module */

const path = require('path');
const webpack = require('webpack');

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
        globalObject : 'globalThis',
    },
    // Adapt only this bundle's anonymous AMD registration; never change the global define.
    // Eagerly initialize in browsers since side-effect imports do not request the AMD module.
    plugins: [
        {
            banner: `;(function(define) {
    if (typeof window !== 'undefined' && typeof define === 'function' && define.amd) {
        var amdDefine = define;
        define = function(dependencies, factory) {
            var autoNumeric = window.AutoNumeric = factory();
            amdDefine(dependencies, function() { return autoNumeric; });
        };
        define.amd = amdDefine.amd;
    }
`,
        },
        {
            footer: true,
            banner: "\n})(typeof define === 'undefined' ? undefined : define);",
        },
    ].map(options => new webpack.BannerPlugin({
        ...options,
        raw: true,
        entryOnly: true,
        test: /\.js$/,
    })),
    resolve: {
        extensions: [
            '.js',
        ],
    },
};

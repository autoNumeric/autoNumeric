/* global module */

module.exports = {
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(bower_components|node_modules)/,

            // cf. chained loaders : http://webpack.github.io/docs/loaders.html#introduction
            loader: 'imports?jQuery=jquery,$=jquery,this=>window!babel',
        }],
    },
    output: {
        libraryTarget: 'umd',
        library: 'autonumeric',
    },
    resolve: {
        extensions: [
            '',
            '.js',
        ],
    },
    externals: {
        // cf. http://webpack.github.io/docs/library-and-externals.html#applications-and-externals
        // and http://webpack.github.io/docs/configuration.html#externals
        jquery: {
            root: 'jQuery',
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery',
        },
    },
};
